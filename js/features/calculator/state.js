

// ======== STATE STEP 1 ========= //
export const calculatorState = {
    currentStep: 'route',

    steps: {
    route: { isValid: false },
    shipment: { isValid: false },
    result: { isValid: false }
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
        }
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
        }
    },
    selectedFiscalMonth: null,

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
    calculatorState[locationName].postcode.selected = postcode;
    calculatorState[locationName].city.selected = city;
}

export function getSelectedCountry(locationName, fieldType) {
   return calculatorState[locationName][fieldType].code;
}

export function setFieldStatus(locationName, fieldType, status, errorType = null) {
  calculatorState[locationName][fieldType].status = status;
  calculatorState[locationName][fieldType].errorType = errorType;

     if (status === 'valid' && fieldType === 'country') {
    calculatorState[locationName][fieldType].hasBeenValidatedOnce = true;
  }
  
    if (fieldType === 'postcode' || fieldType === 'city') {
        calculatorState[locationName].postcode.status = status;
        calculatorState[locationName].city.status = status;
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
        calculatorState[locationName].postcode.status === 'valid' &&
        calculatorState[locationName].city.status === 'valid'
    );
}

export function setSelectedMonth(month) {
    calculatorState.selectedFiscalMonth = month;
}

export function getSelectedMonth() {
    return calculatorState.selectedFiscalMonth;
}



// ======== FULL ROAD ========= //

const routingDetails = {
    loadType: 'full-load',
};


// Routing Details Getters & Setters
export function setLoadType(loadType) {
    routingDetails.loadType = loadType;
}

export function getLoadType() {
    return routingDetails.loadType;
}

export function setFullRoadVehicleType(index, type) {
    const vehicle = calculatorState.shipmentDetails.fullRoad.vehicles[index];

    if (!vehicle) return;

    vehicle.type = type;
    vehicle.status = type ? 'valid' : 'idle';
}

export function isFullRoadComplete() {
    return calculatorState.shipmentDetails.fullRoad.vehicles.every( 
        v => v.type !== ''
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


// remove vehicle
export function removeFullRoadVehicle(vehicleId) {
    const vehicles = calculatorState.shipmentDetails.fullRoad.vehicles;

    calculatorState.shipmentDetails.fullRoad.vehicles = vehicles.filter(
        vehicle => vehicle.id !== vehicleId
    )
}


// vehicle duplicate control
export function hasDuplicateFullRoadVehicles() {
    const types = calculatorState.shipmentDetails.fullRoad.vehicles
    .map(vehicle => vehicle.type)
    .filter(Boolean);

    return new Set(types).size !== types.length;
}