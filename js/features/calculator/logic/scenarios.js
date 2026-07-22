import { IMPLEMENTED_SCENARIOS } from "../shipment/config.js";

const DESTINATION_AREAS = ['continental', 'non-europe'];

export function getCalculatorScenario({ loadType, destinationArea }) {

    if (loadType === 'full-load' && destinationArea === 'continental') {
        return 'full-road';
    }

    if (loadType === 'full-load') {
        return 'full-sea';
    }

    if (loadType === 'partial-load' && destinationArea === 'continental') {
        return 'partial-road';
    }

    return 'partial-air';
}

export function isLoadTypeFullyUnavailable(loadType) {
    return DESTINATION_AREAS.every(destinationArea => {
        const scenario = getCalculatorScenario({ loadType, destinationArea });
        return !IMPLEMENTED_SCENARIOS.includes(scenario);
    })
}