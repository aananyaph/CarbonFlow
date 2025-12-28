export enum UserSegment {
  TECH_PARK = 'TECH_PARK',
  INSTITUTION = 'INSTITUTION',
  RESIDENTIAL = 'RESIDENTIAL',
}

export enum ChargerLevel {
  LEVEL_1 = 'LEVEL_1', // 1-2 kW
  LEVEL_2 = 'LEVEL_2', // 3-22 kW
  LEVEL_3 = 'LEVEL_3', // 25-150 kW
  LEVEL_4 = 'LEVEL_4', // 150-350+ kW
}

export interface AppState {
  latitude: number;
  longitude: number;
  solarCapacityKW: number;
  batteryCapacityKWh: number;
  segment: UserSegment;
  chargerLevel: ChargerLevel;
  gridTariff: number; // Calculated based on segment or custom
  startDate: string;
  endDate: string;
}

export interface HourlyDataPoint {
  hour: string;
  solarGeneration: number;
  evDemand: number;
  gridUsage: number;
  batteryLevel: number; // SoC in kWh
  batteryDischarge: number;
  batteryCharge: number;
  costWithoutSolar: number;
  costWithSolar: number;
}

export interface FinancialSummary {
  dailyGridCost: number;
  dailySolarSavings: number; // Money saved on electricity bill
  dailyCO2Avoided: number; // kg
  dailyCarbonCredits: number; // units (approx)
  dailyCarbonRevenue: number; // ₹
  totalDailyBenefit: number; // Savings + Revenue
  solarSelfConsumption: number; // kWh
  percentSelfPowered: number; // %
}

export interface SimulationResult {
  hourlyData: HourlyDataPoint[];
  summary: FinancialSummary;
}