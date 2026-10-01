import { MONTHS } from './config.js';
import { loadFiscalMonths } from './storage.js';
import { createFiscalMonths, findFiscalMonthById } from './state.js';

// Single entry point to read fiscal months: the saved ones, or the defaults for that year
export function getFiscalMonths(year) {
    return loadFiscalMonths(year) || createFiscalMonths(MONTHS, year);
}

export function getFiscalMonth({ id, year }) {
    return findFiscalMonthById(getFiscalMonths(year), id);
}
