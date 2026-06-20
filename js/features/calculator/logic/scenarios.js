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