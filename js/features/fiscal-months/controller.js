import { createFiscalMonths, markFiscalMonthsAsSaved, setClosingDate } from './state.js'
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
        markFiscalMonthsAsSaved(fiscalMonths);
        saveFiscalMonths(year, fiscalMonths);
        render.renderFiscalMonths(fiscalMonths, grid);
    })


    /* --- GRID --- */
    grid.addEventListener('change', (event) => {
        const input = event.target.closest('[data-month-id]');
        if (!input) return;
            const monthId = input.dataset.monthId;
            const newDate = input.value;

            setClosingDate(fiscalMonths, monthId, newDate);
            render.renderFiscalMonths(fiscalMonths, grid);
    });

}
