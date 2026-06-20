import { setActiveNav } from "../utils/dom-utils.js";
import { initFiscalMonthsController } from "../features/fiscal-months/controller.js";


function initFiscalMonthsPage() {
    const fiscalMonthsRoot = document.querySelector('[data-fiscal-months]');
    if (!fiscalMonthsRoot) return;

    const navItems = document.querySelectorAll('[data-nav-item]');
    setActiveNav(navItems, 'fiscal-months');

    const elements = {
        fiscalYearSettings: {
            selectFiscalYear: fiscalMonthsRoot.querySelector('[data-fiscal-year-input]'),
            saveAllButton: fiscalMonthsRoot.querySelector('[data-fiscal-year-save-button]')
        },
        grid: fiscalMonthsRoot.querySelector('[data-fiscal-months-grid]')
    }

    initFiscalMonthsController(elements);
}


export { initFiscalMonthsPage };