
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
        const stateDiv = document.createElement('div');
        const footerIcon = document.createElement('img');
        const stateText = document.createElement('span');
        const saveButton = document.createElement('button');

        // assign css classes 
        card.classList.add('fiscal-month-card');
        header.classList.add('fiscal-month-card__header');
        title.classList.add('fiscal-month-card__title');

        body.classList.add('fiscal-month-card__body');
        label.classList.add('fiscal-month-card__field');
        input.classList.add('fiscal-month-card__input');    
        calendarIcon.classList.add('fiscal-month-card__calendar-icon');
        
        if (element.status === 'unsaved') {
            card.classList.add('month-value-unsaved');
            saveButton.hidden = false;
        } else if (element.status === 'saved') {
            card.classList.add('month-value-saved');
            saveButton.hidden = true;
        } else {
            card.classList.add('month-value-modify');
            saveButton.hidden =  true;
        }

        footer.classList.add('fiscal-month-card__footer');
        stateDiv.classList.add('fiscal-month-card__state-div')
        footerIcon.classList.add('fiscal-month-card__footer-icon')
        stateText.classList.add('fiscal-month-card__state');
        saveButton.classList.add('btn--secondary', 'fiscal-month-card__save-button');

        // assign values
        title.textContent = element.fullLabel;

        input.type = 'date';
        input.id = element.id;
        input.value = element.closingDate;
        input.dataset.inputMonthId = element.id;
        label.htmlFor = element.id;

        calendarIcon.src = 'assets/icons/calendar-simple.png';
        footerIcon.src = element.footerIcon;
        stateText.textContent = element.status;
        saveButton.textContent = 'save';
        saveButton.dataset.buttonMonthId = element.id;
        

        // assembly
        header.append(title);
        label.append(input, calendarIcon);
        body.append(label);
        stateDiv.append(footerIcon, stateText)
        footer.append( stateDiv, saveButton);

        card.append(header, body, footer);
        grid.append(card);
    });
}

