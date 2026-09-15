/**
 * AltruBiz ROI / Lost-Leads Calculator
 *
 * Pure calculation layer for the interactive ROI calculator (/roi-calculator).
 * Keeps the "money already going to waste" figure separate from the
 * "opportunity" figure (uplift + time savings, summed together) so the
 * headline numbers stay conservative and defensible.
 */

export interface RoiCalculatorInputs {
    leadsPerMonth: number;
    avgDealValue: number;
    closeRatePercent: number;
    hoursSpentPerMonth: number;
    hourlyCost: number;
    targetUpliftPercent: number;
}

export const ROI_CALCULATOR_DEFAULTS: RoiCalculatorInputs = {
    leadsPerMonth: 100,
    avgDealValue: 2000,
    closeRatePercent: 10,
    hoursSpentPerMonth: 15,
    hourlyCost: 100,
    targetUpliftPercent: 5,
};

export interface RoiCalculatorResults {
    revenueAtRisk: number;
    upliftValue: number;
    timeSavingsValue: number;
    combinedPotentialValue: number;
}

export function calculateRoi(inputs: RoiCalculatorInputs): RoiCalculatorResults {
    const revenueAtRisk = inputs.leadsPerMonth * (1 - inputs.closeRatePercent / 100) * inputs.avgDealValue;
    const upliftValue = inputs.leadsPerMonth * (inputs.targetUpliftPercent / 100) * inputs.avgDealValue;
    const timeSavingsValue = inputs.hoursSpentPerMonth * inputs.hourlyCost;
    const combinedPotentialValue = upliftValue + timeSavingsValue;

    return { revenueAtRisk, upliftValue, timeSavingsValue, combinedPotentialValue };
}

export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('he-IL').format(Math.round(value));
}
