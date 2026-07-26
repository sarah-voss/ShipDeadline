

// ======== STATE STEP 1 ========= //
export const calculatorState = {
    currentStep: 'route',
    loadType: 'full-road',

    steps: {
    route: { isValid: false },
    shipment: { isValid: false },
    result: { isValid: false },
    },
    
    departure: {
        country: {
            inputValue: '',
            selected: null,
            code: null,
            status: 'idle',
            errorType: null,
            hasBeenValidatedOnce: false,
        },
        postcode: {
            inputValue: '',
            selected: null,
            status: 'idle',
            errorType: null
        },
        city: {
            inputValue: '',
            selected: null,
            status: 'idle',
            errorType: null,
        },

        coordinates: {
            lon: null,
            lat: null
        },
    },

    destination: {
        country: {
            inputValue: '',
            selected: null,
            code: null,
            status: 'idle',
            errorType: null,
            hasBeenValidatedOnce: false,
        },
        postcode: {
            inputValue: '',
            selected: null,
            status: 'idle',
            errorType: null,
        },
        city: {
            inputValue: '',
            selected: null,
            status: 'idle',
            errorType: null,
        },

        coordinates: {
            lon: null,
            lat: null
        },
    },

    selectedFiscalMonth: {
        id: null,
        fullLabel: null,
        monthLabel: null,
        year: null,
        closingDate: null,
    },

    shipmentDetails: {
        fullRoad: {
            vehicles: [
                { id: Date.now(), type: '', status: 'idle' }
            ]
        },
    },
};



// ==== GENERAL ==== //

export function getCurrentStep() {
    return calculatorState.currentStep;
}

export function setCurrentStep(step) {
    calculatorState.currentStep = step;
}

export function getStepValidity(step) {
 return calculatorState.steps[step].isValid;
}

export function setStepValidity(step, isValid) {
    calculatorState.steps[step].isValid = isValid;
}

export function setLoadType(loadType) {
    calculatorState.loadType = loadType;
}

export function getLoadType() {
    return calculatorState.loadType;
}

export function getSelectedVehicles() {
    return calculatorState.shipmentDetails.fullRoad.vehicles;
}


// ==== ROUTE ==== //

export function setInputValue(locationName, fieldType, value) {
    calculatorState[locationName][fieldType].inputValue = value;
    calculatorState[locationName][fieldType].selected = null;
    calculatorState[locationName][fieldType].code = null;
}

export function setSelectedCountry(locationName, fieldType, country, code) {
    calculatorState[locationName][fieldType].selected = country;
    calculatorState[locationName][fieldType].code = code;
}

export function setSelectedPostcodeCity(locationName, postcode, city) {
    calculatorState[locationName].city.selected = city;
    calculatorState[locationName].postcode.selected = postcode;
}

export function getSelectedCountry(locationName) {
   return calculatorState[locationName].country.code;
}

export function setFieldStatus(locationName, fieldType, status, errorType = null) {
  calculatorState[locationName][fieldType].status = status;
  calculatorState[locationName][fieldType].errorType = errorType;

     if (status === 'valid' && fieldType === 'country') {
    calculatorState[locationName][fieldType].hasBeenValidatedOnce = true;
  }
}

export function getFieldStatus(locationName, fieldType) {
    return calculatorState[locationName][fieldType].status;
}

export function getSelectedLocation(locationName, fieldType) {
 return calculatorState[locationName][fieldType].selected;
}

export function isFieldAreaComplete(locationName) {
    return (
        calculatorState[locationName].country.status === 'valid' &&
        ['valid', 'not-applicable'].includes(calculatorState[locationName].postcode.status) &&
        calculatorState[locationName].city.status === 'valid'
    );
}

export function setSelectedMonth(month) {
    calculatorState.selectedFiscalMonth = month;
}

export function getSelectedMonth() {
    return calculatorState.selectedFiscalMonth;
}



// COORDINATES

export function setSelectedCoordinates(locationName, coordinates) {
calculatorState[locationName].coordinates = coordinates;
}

export function getSelectedCoordinates() {
    const departureCoords = calculatorState.departure.coordinates;
    const destinationCoords = calculatorState.destination.coordinates;
    return { departureCoords, destinationCoords};
}


// ======== FULL ROAD ========= //


export function setFullRoadVehicleType(index, type) {
    const vehicle = calculatorState.shipmentDetails.fullRoad.vehicles[index];

    if (!vehicle) return;

    vehicle.type = type;

    if (isVehicleDuplicate(vehicle.id)) {
        vehicle.status = 'error';
        return;
    }

    vehicle.status = type ? 'valid' : 'idle';
}

export function isFullRoadComplete() {
    return calculatorState.shipmentDetails.fullRoad.vehicles.every( 
        v => v.status === 'valid'
    );
}

// add new vehicle
export function addFullRoadVehicle() {
    const vehicles = calculatorState.shipmentDetails.fullRoad.vehicles;
    const newVehicle = {
        id: Date.now(),
        type: '',
        status: 'idle'
    };

    vehicles.push(newVehicle);

    return newVehicle;
}


// get vehicles
export function getFullRoadVehicle() {
    return calculatorState.shipmentDetails.fullRoad.vehicles;
}


// remove vehicle
export function removeFullRoadVehicle(vehicleId) {
    const vehicles = calculatorState.shipmentDetails.fullRoad.vehicles;

    calculatorState.shipmentDetails.fullRoad.vehicles = vehicles.filter(
        vehicle => vehicle.id !== vehicleId
    )
}


// vehicle duplicate control
export function isVehicleDuplicate(vehicleId) {
    const vehicles = calculatorState.shipmentDetails.fullRoad.vehicles;
    const target = vehicles.find(v => v.id === vehicleId);
    if (!target.type) return false;
    const index = vehicles.findIndex(v => v.id === vehicleId);
    const shortenedVehiclesArray = vehicles.slice(0, index);
    return shortenedVehiclesArray.some(v => v.type === target.type);
}

export function hasDuplicateFullRoadVehicles() {
    const vehicles = calculatorState.shipmentDetails.fullRoad.vehicles;
    return vehicles.some(v => isVehicleDuplicate(v.id));
}