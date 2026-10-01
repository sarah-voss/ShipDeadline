import { renderFullRoadMode } from "../renderers/shipment-step/full-road-step-render.js";
import { renderComingSoonMode } from "../renderers/calculator-render.js";
import { VEHICLES } from "./vehicles.js";

export const SCENARIO_RENDERERS = {
    'full-road': renderFullRoadMode,
    'full-sea': renderComingSoonMode,
    'partial-road': renderComingSoonMode,
    'partial-air': renderComingSoonMode,
};

export const IMPLEMENTED_SCENARIOS = ['full-road'];

// select options built from VEHICLES, so labels can't drift apart
export const VEHICLE_OPTIONS = [
    { value: '', label: 'Select vehicle type' },
    ...Object.entries(VEHICLES).map(([value, vehicle]) => ({ value, label: vehicle.label })),
];

export const MAX_FULL_ROAD_VEHICLES = 3;