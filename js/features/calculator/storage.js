const STORAGE_KEY = 'shipDeadline:calculator';

export function saveCalculatorState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadCalculatorState() {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) return;

    try {
        return JSON.parse(data);
    } catch {
        return;
    }
}

