const leftColumn = document.getElementById('left-column');
const rightColumn = document.getElementById('right-column');
const completeButton = document.getElementById('complete-button');

let index = 0;
const result = {
    D: 0,
    I: 0,
    S: 0,
    C: 0
}

function checkCompletion() {
    const rightSlots = Array.from(rightColumn.children);
    const allFilled = rightSlots.every(slot => slot.hasAttribute('data-value'));
    completeButton.disabled = !allFilled;
}

function appendScore() {
    if (!index) return;

    const rightSlots = Array.from(rightColumn.children);
    rightSlots.forEach((slot, index) => {
        const type = slot.dataset.type;
        const reversedIndex = rightSlots.length - index - 1;
        result[type] += reversedIndex;
    });
}

function redirectToResultPage() {
    const { D, I, S, C } = result;
    const queryString = `d=${D}&i=${I}&s=${S}&c=${C}`;
    const url = `result?${queryString}`;
    window.location.href = url;
}

function handleDragStart(e) {
    e.dataTransfer.setData('value', e.target.textContent);
    e.dataTransfer.setData('source', e.target.parentElement.id);
    e.dataTransfer.setData('sourceIndex', Array.from(e.target.parentElement.children).indexOf(e.target));
    setTimeout(() => {
        e.target.classList.add('dragging');
    }, 0);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData('value');
    const sourceId = e.dataTransfer.getData('source');
    const sourceIndex = e.dataTransfer.getData('sourceIndex');
    const sourceColumn = document.getElementById(sourceId);
    const sourceSlot = sourceColumn.children[sourceIndex];

    if (e.target.classList.contains('slot') && e.target.parentElement === rightColumn) {
        const targetSlot = e.target;
        targetSlot.textContent = data;

        // preserve existing values (if any)
        const targetValue = targetSlot.dataset.value;
        const targetType = targetSlot.dataset.type;

        targetSlot.dataset.value = data;
        targetSlot.dataset.type = sourceSlot.dataset.type;
        targetSlot.classList.add("item");

        // Moving from left to right
        if (sourceColumn == leftColumn) {
            // To empty target
            if (!targetValue) {
                sourceSlot.textContent = "";
                sourceSlot.removeAttribute('draggable');
                sourceSlot.removeAttribute("data-type");
                sourceSlot.style.visibility = "hidden";
            }
            // To non-empty target
            else {
                sourceSlot.textContent = targetValue;
                sourceSlot.dataset.type = targetType;
                // keep draggable
            }
        }
        // Moving right items
        else {
            // To non-empty target
            if (targetValue) {
                sourceSlot.textContent = targetValue;
                sourceSlot.dataset.value = targetValue;
                sourceSlot.dataset.type = targetType;
            }
            // To empty target
            else {
                sourceSlot.textContent = sourceSlot.dataset.key;
                sourceSlot.removeAttribute('data-value');
                sourceSlot.removeAttribute('data-type');
                sourceSlot.classList.remove("item");
                sourceSlot.removeAttribute('draggable');
            }
        }

        targetSlot.setAttribute('draggable', true);
        
        checkCompletion();
    }
}

function renderData() {
    appendScore();

    if (index === data.length) redirectToResultPage();

    leftColumn.innerHTML = '';
    rightColumn.innerHTML = '';
    
    const value = data[index];

    leftColumn.appendChild(createLeftItem(value.D, "D"));
    leftColumn.appendChild(createLeftItem(value.I, "I"));
    leftColumn.appendChild(createLeftItem(value.S, "S"));
    leftColumn.appendChild(createLeftItem(value.C, "C"));

    rightColumn.appendChild(createRightItem("Много"));
    rightColumn.appendChild(createRightItem("Повечето време"));
    rightColumn.appendChild(createRightItem("Понякога"));
    rightColumn.appendChild(createRightItem("Рядко"));

    document.querySelectorAll('.slot').forEach(slot => {
        slot.addEventListener('dragstart', handleDragStart);
        slot.addEventListener('dragend', handleDragEnd);
        slot.addEventListener('dragover', handleDragOver);
        slot.addEventListener('drop', handleDrop);
    });

    index++;
    completeButton.innerText = index == data.length ? "Провери" : "Следващ";
    completeButton.disabled = true;
    updateProgress();
}

function createLeftItem(value, type) {
    const leftSlot = document.createElement('div');
    leftSlot.className = 'slot item';
    leftSlot.dataset.type = type;
    leftSlot.draggable = true;
    leftSlot.textContent = value;
    return leftSlot;
}

function createRightItem(value) {
    const rightSlot = document.createElement('div');
    rightSlot.className = 'slot';
    rightSlot.dataset.key = value;
    rightSlot.textContent = value;
    return rightSlot;
}

function updateProgress() {
    if (index === 1) return;

    const progress = document.getElementById("progress");
    
    const percent = (index / data.length) * 100;
    
    progress.style.width = Math.min(percent, 100) + "%";
  }

renderData(0);