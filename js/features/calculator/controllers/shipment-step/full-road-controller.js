
import * as calculatorRender from "../../renderers/calculator-render.js";
import * as state from "../../state.js";

import { getCalculatorScenario } from "../../logic/scenarios.js";
import { MODE_RENDERERS, MAX_FULL_ROAD_VEHICLES } from "../../shipment/config.js";
import { getDestinationArea, getCountryFieldStatus } from '../../logic/geography-rules.js';
import { saveCalculatorState } from "../../storage.js";
import { renderAddButtonVisibility, renderDuplicateWarning } from "../../renderers/shipment-step/full-road-step-render.js";



export function initFullRoadController({ elements, onFullRoadChange }) {

    const { calculatorSteps } = elements;
    
    // ==========================================
    //  ===  HELPER FUNCTIONS ===
    // ==========================================

        function recalculateShipmentValidity() {
            const vehicles = state.calculatorState.shipmentDetails.fullRoad.vehicles;

            vehicles.forEach(vehicle => {
                const vehicleContainer = calculatorSteps.shipment.querySelector(`[data-vehicle-id="${vehicle.id}"]`);
                if (!vehicleContainer) return;

            const isDuplicate = state.isVehicleDuplicate(vehicle.id);
            renderDuplicateWarning(vehicleContainer, isDuplicate);

            const fieldStatus = isDuplicate ? 'error' : vehicle.status;
            calculatorRender.renderFieldState(vehicleContainer, fieldStatus);
        });

        const hasDuplicates = state.hasDuplicateFullRoadVehicles();
        const isComplete = state.isFullRoadComplete() && !hasDuplicates
        const isAddButtonVisible = isComplete && vehicles.length < MAX_FULL_ROAD_VEHICLES;

        renderAddButtonVisibility(calculatorSteps.shipment, isAddButtonVisible);
        state.setStepValidity('shipment', isComplete);
    }

    function getCurrentFullRoadScenario() {
        const selectedCountry = state.getSelectedLocation('destination', 'country');
        return getCalculatorScenario({
            loadType: state.getLoadType(),
            destinationArea: getDestinationArea(selectedCountry),
        });
    }

    // ==========================================
    //  ===  EVENT LISTENERS ===
    // ==========================================

       calculatorSteps.shipment.addEventListener('change', (e) => {
        const select = e.target.closest('[data-vehicle-select]');
        if (!select) return;

        const value = select.value;
        const vehicleId = Number(select.dataset.vehicleId);
        const vehicles = state.calculatorState.shipmentDetails.fullRoad.vehicles;
        const vehicleIndex = vehicles.findIndex(v => v.id === vehicleId);

        state.setFullRoadVehicleType(vehicleIndex, value);

        recalculateShipmentValidity();
        saveCalculatorState(state.calculatorState);
        onFullRoadChange();
       })


    // add Vehicle
       calculatorSteps.shipment.addEventListener('click', (e) => {
        const addButton = e.target.closest('[data-add-vehicle]');
        if (!addButton) return;

        const vehicles = state.calculatorState.shipmentDetails.fullRoad.vehicles;
        if (vehicles.length >= MAX_FULL_ROAD_VEHICLES) return;

        state.addFullRoadVehicle();

        const scenario = getCurrentFullRoadScenario();
        const renderMode = MODE_RENDERERS[scenario];
        renderMode(calculatorSteps.shipment, vehicles);

        recalculateShipmentValidity();
        saveCalculatorState(state.calculatorState);
        onFullRoadChange();

       })

      

      // remove Vehicle
       calculatorSteps.shipment.addEventListener('click', (e) => {
        const removeButton = e.target.closest('[data-remove-vehicle]');
        if (!removeButton) return;

        state.removeFullRoadVehicle(Number(removeButton.dataset.vehicleId));

        const vehicles = state.calculatorState.shipmentDetails.fullRoad.vehicles;
        const scenario = getCurrentFullRoadScenario();
        const renderMode = MODE_RENDERERS[scenario];
        renderMode(calculatorSteps.shipment, vehicles);

        recalculateShipmentValidity();
        saveCalculatorState(state.calculatorState);
        onFullRoadChange();
       })

}