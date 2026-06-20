
export function renderFiscalMonths(arr, grid) {
    grid.innerHTML = '';
    
    if (!Array.isArray(arr)) return;

    arr.forEach(element => {

        // build html elements
        const card = document.createElement('article');
        const header = document.createElement('header');
        const title = document.createElement('h2');

        const body = document.createElement('div');
        const label = document.createElement('label');
        const input = document.createElement('input');
        const calendarIcon = document.createElement('img');

        const footer = document.createElement('footer');
        const footerIcon = document.createElement('img');
        const stateText = document.createElement('span');

        // assign css classes 
        card.classList.add('fiscal-month__card');
        header.classList.add('fiscal-month-card__header');
        title.classList.add('fiscal-month-card__title');

        body.classList.add('fiscal-month-card__body');
        label.classList.add('fiscal-month-card__field');
        input.classList.add('fiscal-month-card__input');    
        calendarIcon.classList.add('fiscal-month-card__calendar-icon');
        
        if (element.status === 'modify closing date') {
            input.classList.add('placeholder');
        } else {
            input.classList.remove('placeholder');
        }

        footer.classList.add('fiscal-month-card__footer');
        footerIcon.classList.add('fiscal-month-card__footer-icon')
        stateText.classList.add('fiscal-month-card__state');

        // assign values
        title.textContent = element.fullLabel;

        input.type = 'date';
        input.id = element.id;
        input.value = element.closingDate;
        input.dataset.monthId = element.id;
        label.htmlFor = element.id;

        calendarIcon.src = 'assets/icons/calendar-simple.png';
        footerIcon.src = element.footerIcon;
        stateText.textContent = element.status;

        // assembly
        header.append(title);
        label.append(input, calendarIcon);
        body.append(label);
        footer.append(footerIcon, stateText);

        card.append(header, body, footer);
        grid.append(card);
    });
}

