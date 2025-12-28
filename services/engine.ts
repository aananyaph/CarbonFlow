import { AppState, HourlyDataPoint, SimulationResult, UserSegment, ChargerLevel } from '../types';

// Constants for simulation
const INDIA_AVG_CO2_PER_KWH = 0.82; // kg CO2 per kWh (Grid intensity)
const CARBON_CREDIT_PRICE_PER_TON_INR = 1500; // Conservative voluntary market price in Rupees
const STD_MERIDIAN = 82.5; // India Standard Time Longitude (UTC+5:30)

// Default tariffs based on segment
export const getTariffForSegment = (segment: UserSegment): number => {
  switch (segment) {
    case UserSegment.TECH_PARK: return 10.0;
    case UserSegment.INSTITUTION: return 8.5;
    case UserSegment.RESIDENTIAL: return 6.5;
    default: return 9.0;
  }
};

const getChargerDemandMultiplier = (level: ChargerLevel): number => {
  switch (level) {
    case ChargerLevel.LEVEL_1: return 0.2; // Very low demand (slow charging)
    case ChargerLevel.LEVEL_2: return 1.0; // Standard baseline
    case ChargerLevel.LEVEL_3: return 5.0; // Fast charging
    case ChargerLevel.LEVEL_4: return 12.0; // Ultra fast
    default: return 1.0;
  }
};

/**
 * Simulates a 24-hour cycle of Solar Generation vs EV Demand
 * incorporating Latitude/Longitude physics to mimic NASA POWER data effects.
 */
export const runSimulation = (inputs: AppState): SimulationResult => {
  const hourlyData: HourlyDataPoint[] = [];
  let currentBatteryLevel = inputs.batteryCapacityKWh * 0.2; // Start day at 20%
  
  const demandMultiplier = getChargerDemandMultiplier(inputs.chargerLevel);

  // --- GEOGRAPHIC SIMULATION LOGIC ---
  
  // 1. Longitude Effect (Time Shift relative to IST)
  // Earth rotates 15 degrees per hour.
  // Standard Meridian (IST) is 82.5°E.
  // If location is West (e.g. 72°), solar noon is later -> Shift curve right (positive offset).
  // If location is East (e.g. 90°), solar noon is earlier -> Shift curve left (negative offset).
  const longitudeShiftHours = (STD_MERIDIAN - inputs.longitude) / 15;
  const solarNoonHour = 12 + longitudeShiftHours;

  // 2. Latitude Effect (Day Length & Intensity)
  // Seasonality derived from startDate
  const date = new Date(inputs.startDate);
  // Calculate Day of Year (1-365)
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  // Simple solar declination approximation (radians)
  const declination = 23.45 * (Math.PI / 180) * Math.sin((2 * Math.PI / 365) * (dayOfYear - 81));
  
  // Day length calculation
  const latRad = inputs.latitude * (Math.PI / 180);
  
  // Hour angle at sunset = acos(-tan(lat) * tan(dec))
  // We clamp values to avoid NaN at extreme latitudes
  const tanLatTanDec = Math.tan(latRad) * Math.tan(declination);
  const clampedTan = Math.max(-1, Math.min(1, tanLatTanDec));
  const hourAngle = Math.acos(-clampedTan); // radians
  const dayLengthHours = (hourAngle * 2) * (180 / Math.PI) / 15; // Convert degrees to hours (15 deg/hr)

  // Intensity factor based on maximum solar elevation at noon (90 - |lat - dec|)
  const decDeg = declination * (180 / Math.PI);
  const maxElevation = 90 - Math.abs(inputs.latitude - decDeg);
  const elevationFactor = Math.sin(maxElevation * (Math.PI / 180));
  
  // Baseline efficiency curve:
  // - High elevation (near 90) -> near 1.0 factor
  // - Low elevation (high lat winter) -> lower factor
  // We apply a minimum floor (0.3) so high latitudes still get some simulated generation
  const intensityFactor = Math.max(0.3, elevationFactor);

  const sunriseHour = solarNoonHour - (dayLengthHours / 2);
  const sunsetHour = solarNoonHour + (dayLengthHours / 2);

  let totalGridCost = 0;
  let totalCostWithoutSolar = 0;
  let totalSolarUsedDirectly = 0;
  let totalBatteryDischarged = 0;

  for (let i = 0; i < 24; i++) {
    const hourLabel = `${i}:00`;
    
    // 1. Simulate Solar Curve 
    let solarGen = 0;
    
    // Check if we are in the daylight window for this location/date
    // i is the integer hour start. We assume generation if the hour overlaps significantly with daylight.
    if (i >= Math.floor(sunriseHour) && i <= Math.ceil(sunsetHour)) {
      
      // Calculate position within the daylight window (0.0 to 1.0)
      // We sample at i + 0.5 (half past the hour) for average
      const sampleTime = i + 0.5;
      
      if (sampleTime > sunriseHour && sampleTime < sunsetHour) {
          const dayProgress = (sampleTime - sunriseHour) / (sunsetHour - sunriseHour);
          
          // Solar curve (Sine wave)
          const peak = inputs.solarCapacityKW * 0.85 * intensityFactor; 
          solarGen = peak * Math.sin(dayProgress * Math.PI);
      }
    }
    
    // Ensure non-negative and fix floating point artifacts
    solarGen = Math.max(0, parseFloat(solarGen.toFixed(2)));

    // 2. Simulate EV Demand
    // Tech parks: Morning arrivals (8-10am), Evening departures (5-7pm) + trickle
    // Residential: Overnight charging
    let evDemand = 0;
    
    // Base load (always on logic)
    evDemand += 2 * demandMultiplier; 

    if (inputs.segment === UserSegment.TECH_PARK) {
      if (i >= 8 && i <= 11) evDemand += (15 * demandMultiplier); // Morning rush
      if (i >= 16 && i <= 19) evDemand += (10 * demandMultiplier); // Evening topups
      if (i > 11 && i < 16) evDemand += (5 * demandMultiplier); // Day trickle
    } else if (inputs.segment === UserSegment.RESIDENTIAL) {
      if (i >= 18 || i <= 7) evDemand += (12 * demandMultiplier); // Night charging
    } else {
      // Mixed/Institution
      if (i >= 9 && i <= 17) evDemand += (8 * demandMultiplier);
    }
    
    // Add some randomness to make charts look organic
    evDemand = evDemand * (0.9 + Math.random() * 0.2);
    
    // 3. Energy Logic
    // Can we cover demand with Solar?
    let gridNeeded = 0;
    let batteryCharge = 0;
    let batteryDischarge = 0;

    const surplusSolar = Math.max(0, solarGen - evDemand);
    const deficitPower = Math.max(0, evDemand - solarGen);

    if (surplusSolar > 0) {
      // Charge Battery
      const spaceIBattery = inputs.batteryCapacityKWh - currentBatteryLevel;
      batteryCharge = Math.min(surplusSolar, spaceIBattery);
      currentBatteryLevel += batteryCharge;
      // Remaining surplus is exported (ignored for simplicity here or net metering)
    } else {
      // Need power. Check Battery first.
      // Simple logic: Discharge if battery > 20%
      const availableBattery = Math.max(0, currentBatteryLevel - (inputs.batteryCapacityKWh * 0.1)); // Keep 10% buffer
      
      if (availableBattery > deficitPower) {
        batteryDischarge = deficitPower;
        currentBatteryLevel -= batteryDischarge;
      } else {
        batteryDischarge = availableBattery;
        currentBatteryLevel -= availableBattery;
        gridNeeded = deficitPower - batteryDischarge;
      }
    }

    // Cost Calculation
    const costStepSolar = gridNeeded * inputs.gridTariff;
    const costStepNoSolar = evDemand * inputs.gridTariff;

    totalGridCost += costStepSolar;
    totalCostWithoutSolar += costStepNoSolar;
    totalSolarUsedDirectly += (solarGen - surplusSolar) + batteryCharge; // Used for EV or stored
    totalBatteryDischarged += batteryDischarge;

    hourlyData.push({
      hour: hourLabel,
      solarGeneration: parseFloat(solarGen.toFixed(2)),
      evDemand: parseFloat(evDemand.toFixed(2)),
      gridUsage: parseFloat(gridNeeded.toFixed(2)),
      batteryLevel: parseFloat(currentBatteryLevel.toFixed(2)),
      batteryCharge: parseFloat(batteryCharge.toFixed(2)),
      batteryDischarge: parseFloat(batteryDischarge.toFixed(2)),
      costWithSolar: parseFloat(costStepSolar.toFixed(2)),
      costWithoutSolar: parseFloat(costStepNoSolar.toFixed(2)),
    });
  }

  // Summary Calculations
  const totalSolarContribution = totalSolarUsedDirectly + totalBatteryDischarged; // Effective solar used
  const dailySolarSavings = totalCostWithoutSolar - totalGridCost;
  const dailyCO2Avoided = totalSolarContribution * INDIA_AVG_CO2_PER_KWH;
  const dailyCarbonCredits = dailyCO2Avoided / 1000; // 1 Credit = 1 Ton
  const dailyCarbonRevenue = dailyCarbonCredits * CARBON_CREDIT_PRICE_PER_TON_INR;
  
  const totalDemand = hourlyData.reduce((acc, curr) => acc + curr.evDemand, 0);

  return {
    hourlyData,
    summary: {
      dailyGridCost: parseFloat(totalGridCost.toFixed(2)),
      dailySolarSavings: parseFloat(dailySolarSavings.toFixed(2)),
      dailyCO2Avoided: parseFloat(dailyCO2Avoided.toFixed(2)),
      dailyCarbonCredits: parseFloat(dailyCarbonCredits.toFixed(4)),
      dailyCarbonRevenue: parseFloat(dailyCarbonRevenue.toFixed(2)),
      totalDailyBenefit: parseFloat((dailySolarSavings + dailyCarbonRevenue).toFixed(2)),
      solarSelfConsumption: parseFloat(totalSolarContribution.toFixed(2)),
      percentSelfPowered: totalDemand > 0 ? parseFloat(((totalSolarContribution / totalDemand) * 100).toFixed(1)) : 0
    }
  };
};