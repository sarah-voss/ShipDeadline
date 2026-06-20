export function getFields(locations, filterFn = () => true) {
    const result = [];
    Object.entries(locations).forEach(([locationName, locationConfig]) => {
        const { area, ...locationFields } = locationConfig;

        Object.entries(locationFields).forEach(([fieldType, fieldConfig]) => {
            if (!filterFn(fieldConfig, fieldType, locationName)) return;

            result.push({
                locationName,
                fieldType,
                area,
                ...fieldConfig
            });
        });
    });
    return result;
}