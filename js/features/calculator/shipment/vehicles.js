// Single source for every vehicle: labels for the UI, speed and loading time for the transit calculation
export const VEHICLES = {
    'standard-truck': {
        label: 'Standard Truck',
        description: '13.6m | 33 pallets | 24 t',
        speedKmh: 70,
        loadingHours: 4,
    },
    'van': {
        label: 'Van',
        description: '3.5 t | up to 5 pallets',
        speedKmh: 85,
        loadingHours: 2,
    },
    'exceptional-load': {
        label: 'Exceptional Load',
        description: 'Special dimensions | permit required',
        speedKmh: 45,
        loadingHours: 6,
    },
};
