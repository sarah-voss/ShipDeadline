import { formatDateForInput } from '../../utils/date-utils.js';

export function createFiscalMonths(arr, year) {
   return arr.map(element => {
        const numeratedMonth = String(element.index + 1).padStart(2, '0');
        const lastDayOfMonth = new Date(year, element.index + 1, 0);
        const defaultClosingDate = formatDateForInput(lastDayOfMonth);
     return {
            month: element.index,
            label: element.label,
            fullLabel: `${element.label} ${year}`,
            year,
            id: `${year}-${numeratedMonth}`,
            closingDate: defaultClosingDate,
            status: 'modify closing date',
            footerIcon: 'assets/icons/pen.png'
        }
    })
}

export function setClosingDate(fiscalMonths, monthId, newDate) {
    fiscalMonths.forEach(month => {
        if (month.id === monthId) {
            month.closingDate = newDate;
            month.status = 'unsaved';
            month.footerIcon = 'assets/icons/warning.png'
        }
    });
    };

export function markFiscalMonthsAsSaved(fiscalMonths) {
    fiscalMonths.forEach(month => {
        if (month.status === 'unsaved') {
            month.status = 'saved';
            month.footerIcon = 'assets/icons/success.png'
        };
    });
}
