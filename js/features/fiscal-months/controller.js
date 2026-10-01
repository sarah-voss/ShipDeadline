import { markUnsavedFiscalMonthsAsSaved, markFiscalMonthAsSaved, replaceFiscalMonth, findFiscalMonthById, setClosingDate } from './state.js'
import * as render from './render.js';
import { saveFiscalMonths } from './storage.js';
import { getFiscalMonths } from './queries.js';

export function initFiscalMonthsController(elements) {

    const {
        grid,
        fiscalYearSettings,
    } = elements;


    // ==== INIT ====

    const saveAllButton = fiscalYearSettings.saveAllButton;
    const selectFiscalYear = fiscalYearSettings.selectFiscalYear;
    let year = Number(selectFiscalYear.value);
    let fiscalMonths = getFiscalMonths(year);

    render.renderFiscalMonths(fiscalMonths, grid);


    // ==== EVENT LISTENERS ====

    selectFiscalYear.addEventListener('change', (e) => {
        year = Number(e.target.value);
        fiscalMonths = getFiscalMonths(year);
        render.renderFiscalMonths(fiscalMonths, grid);
    });


    saveAllButton.addEventListener('click', () => {
        markUnsavedFiscalMonthsAsSaved(fiscalMonths);
        saveFiscalMonths(year, fiscalMonths);
        render.renderFiscalMonths(fiscalMonths, grid);
    })


    // Changing a date marks the month as unsaved
    grid.addEventListener('change', (event) => {
        const input = event.target.closest('[data-input-month-id]');
        if (!input) return;
        const monthId = input.dataset.inputMonthId;
        const newDate = input.value;

        setClosingDate(fiscalMonths, monthId, newDate);
        render.renderFiscalMonths(fiscalMonths, grid);
    });

    // Clicking anywhere on a card opens its date picker, except on the save button
    grid.addEventListener('click', (event) => {
        if (event.target.closest('[data-button-month-id]')) return;
        const card = event.target.closest('.fiscal-month-card');
        if (!card) return;
        const input = card.querySelector('[data-input-month-id]');
        input?.showPicker();
    })


    // Saves only this month: other unsaved cards keep their stored value
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
        const storedMonths = getFiscalMonths(year);
        saveFiscalMonths(year, replaceFiscalMonth(storedMonths, savedMonth));

        render.renderFiscalMonths(fiscalMonths, grid);
    })

}
