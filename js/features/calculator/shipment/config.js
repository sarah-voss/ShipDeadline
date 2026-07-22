import { renderFullRoadMode } from "../renderers/shipment-step/full-road-step-render.js";
import { renderComingSoonMode } from "../renderers/calculator-render.js";

export const MODE_RENDERERS = {
    'full-road': renderFullRoadMode,
    'full-sea': renderComingSoonMode,
    'partial-road': renderComingSoonMode,
    'partial-air': renderComingSoonMode,
};

export const IMPLEMENTED_SCENARIOS = ['full-road'];

export const VEHICLE_OPTIONS = [
    { value: '', label: 'Select vehicle type' },
    { value: 'standard-truck', label: 'Standard truck' },
    { value: 'van', label: 'Van' },
    { value: 'exceptional-load', label: 'Exceptional load' }
];

export const MAX_FULL_ROAD_VEHICLES = 3;