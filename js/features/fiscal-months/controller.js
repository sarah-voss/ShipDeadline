import { createFiscalMonths, markUnsavedFiscalMonthsAsSaved, markFiscalMonthAsSaved, replaceFiscalMonth, findFiscalMonthById, setClosingDate } from './state.js'
import { MONTHS } from './config.js';
import * as render from './render.js';
import { saveFiscalMonths, loadFiscalMonths } from './storage.js';

export function initFiscalMonthsController(elements) {

    // destructure values
    const {
        grid,
        fiscalYearSettings,
    } = elements;

    /* Set inital values Fiscal Year */
    const saveAllButton = fiscalYearSettings.saveAllButton;
    const selectFiscalYear = fiscalYearSettings.selectFiscalYear;
    let year = Number(selectFiscalYear.value);
    let fiscalMonths = loadFiscalMonths(year) || createFiscalMonths(MONTHS, year);

    render.renderFiscalMonths(fiscalMonths, grid);

    // ==========================================
    //  === EVENT LISTENERS FISCAL MONTHS ===
    // ==========================================

    /* --- SETTINGS --- */

    /* Select Year */
    selectFiscalYear.addEventListener('change', (e) => {
        year = Number(e.target.value);
        fiscalMonths = loadFiscalMonths(year) || createFiscalMonths(MONTHS, year);
        render.renderFiscalMonths(fiscalMonths, grid);
    });


    /* Save All */
    saveAllButton.addEventListener('click', () => {
        markUnsavedFiscalMonthsAsSaved(fiscalMonths);
        saveFiscalMonths(year, fiscalMonths);
        render.renderFiscalMonths(fiscalMonths, grid);
    })


    /* --- GRID --- */
    grid.addEventListener('change', (event) => {
        const input = event.target.closest('[data-input-month-id]');
        if (!input) return;
        const monthId = input.dataset.inputMonthId;
        const newDate = input.value;

        setClosingDate(fiscalMonths, monthId, newDate);
        render.renderFiscalMonths(fiscalMonths, grid);
    });

    grid.addEventListener('click', (event) => {
        if (event.target.closest('[data-button-month-id]')) return;
        const card = event.target.closest('.fiscal-month-card');
        if (!card) return;
        const input = card.querySelector('[data-input-month-id]');
        input?.showPicker();
    })


    grid.addEventListener('click', (event) => {
        const saveButton = event.target.closest('[data-button-month-id]');
        if (!saveButton) return;

        const card = saveButton.closest('.fiscal-month-card');
        const input = card.querySelector('[data-input-month-id]');

        const monthId = saveButton.dataset.buttonMonthId;

        const newDate = input.value;

        setClosingDate(fiscalMonths, monthId, newDate);
        markFiscalMonthAsSaved(fiscalMonths, monthId);

        const savedMonth = findFiscalMonthById(fiscalMonths, monthId);
        const storedMonths = loadFiscalMonths(year) || createFiscalMonths(MONTHS, year);
        saveFiscalMonths(year, replaceFiscalMonth(storedMonths, savedMonth));

        render.renderFiscalMonths(fiscalMonths, grid);
    })

}
