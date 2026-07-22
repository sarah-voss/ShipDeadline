import { VEHICLE_OPTIONS, MAX_FULL_ROAD_VEHICLES } from '../../shipment/config.js';
import { renderFieldState } from '../calculator-render.js';

export function renderFullRoadMode(container, vehicles) {
   
    // create html elements
    const title = document.createElement('h2');
    const descriptionContainer = document.createElement('div');
    const descriptionIcon = document.createElement('img');
    const descriptionText = document.createElement('p');
    const vehiclesList = document.createElement('div');
    const addButton = document.createElement('button');
    const buttonIcon = document.createElement('img');
    const buttonText = document.createElement('span');


    // add css classes and properties
    title.textContent = 'Road Transport details';
    descriptionContainer.classList.add('description-container');
    descriptionIcon.classList.add('description-icon');
    descriptionIcon.src = '/assets/icons/right-arrow.png';
    descriptionText.classList.add('description-text');
    descriptionText.textContent = 'The selected vehicle type may slightly affect the estimated transit time.';

    vehiclesList.classList.add('vehicles-list');

    addButton.classList.add('add-vehicle-button');
    addButton.dataset.addVehicle = 'true';
    addButton.type = 'button';
    buttonIcon.classList.add('add-vehicle__icon');
    buttonIcon.src = '/assets/icons/plus.png';
    buttonText.classList.add('add-vehicle__text');
    buttonText.textContent = 'Add another vehicle';

    if (!vehicles.every(v => v.status === 'valid') || vehicles.length >= MAX_FULL_ROAD_VEHICLES) {
        addButton.classList.add('visually-hidden');
    }


    // assembly
    descriptionContainer.append(descriptionIcon, descriptionText);
    addButton.append(buttonIcon, buttonText);
    container.replaceChildren(title, descriptionContainer, vehiclesList, addButton);

    vehicles.forEach((vehicle, index) => {
        const vehicleItem = createVehicleItem(vehicle, index);
        vehiclesList.append(vehicleItem);
    });

}


    function createVehicleItem(vehicle, index) {
    const vehicleContainer = document.createElement('div');
    const vehicleContent = document.createElement('div');
    const label = document.createElement('label');
    const selectWrapper = document.createElement('div');
    const select = document.createElement('select');
    const successIcon = document.createElement('span')
    const warning = document.createElement('p');
    

    vehicleContainer.classList.add('vehicle-container');
    vehicleContainer.dataset.vehicleContainer = '';
    vehicleContainer.dataset.vehicleId = vehicle.id;

    vehicleContent.classList.add('vehicle-content');

    label.classList.add('select-vehicle__label');
    label.textContent = `Vehicle ${index + 1}`;

    selectWrapper.classList.add('select-vehicle-wrapper');

    select.classList.add('select-vehicle');
    select.dataset.vehicleSelect = 'true';
    select.dataset.vehicleId = vehicle.id;

    successIcon.dataset.successIcon = '';
    successIcon.classList.add('helper-icon-success');
    successIcon.textContent = '✔';


    warning.dataset.duplicateWarning = '';
    warning.classList.add('error-message', 'error-message--duplicate');
    warning.textContent = 'Duplicate vehicle type. Each vehicle must be a different type, as transit time varies by vehicle - not by quantity';

    selectWrapper.append(select, successIcon);
    vehicleContent.append(label, selectWrapper, warning);
    vehicleContainer.append(vehicleContent);

    renderFieldState(vehicleContainer, vehicle.status);

    VEHICLE_OPTIONS.forEach(({ value, label: optionLabel }) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = optionLabel;
        select.append(option);
    });

    select.value = vehicle.type;

    if (index > 0) {
        const removeButton = document.createElement('button');
        const removeIcon = document.createElement('img');

        removeButton.type = 'button';
        removeButton.classList.add('remove-button');
        removeButton.dataset.removeVehicle = 'true';
        removeButton.dataset.vehicleId = vehicle.id;
        
        removeIcon.classList.add('remove-icon');
        removeIcon.src = '/assets/icons/remove-icon.png';

        removeButton.append(removeIcon);
        vehicleContainer.append(removeButton);
        
    }

    return vehicleContainer;
}

export function renderAddButtonVisibility(container, isVisible) {
    const addButton = container.querySelector('[data-add-vehicle]');
    addButton.classList.toggle('visually-hidden', !isVisible);
}

export function renderDuplicateWarning(vehicleContainer, isDuplicate) {
vehicleContainer.classList.toggle('duplicate', isDuplicate);
}