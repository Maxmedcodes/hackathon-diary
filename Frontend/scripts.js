
    const entryList = document.querySelector('.entry-list');
    const addEntryBtn = document.querySelector('.add-entry-btn');
    const saveBtn = document.querySelector('.btn-save');
    const deleteBtn = document.querySelector('.btn-delete');
    const dateInput = document.querySelector('.date-input');
    const textEditor = document.querySelector('.text-editor');

    let entries = []; // Array to hold entry objects
    let activeIndex = null; // Track selected entry

    // Load initial entries
    document.querySelectorAll('.entry-item').forEach((item, index) => {
        const date = item.querySelector('.entry-date').innerText;
        const text = item.querySelector('.entry-preview').innerText;

        entries.push({ date, text });
        item.addEventListener('click', () => loadEntry(index));
    });

    function loadEntry(index) {
        const entry = entries[index];
        if (!entry) return;
        activeIndex = index;
        textEditor.value = entry.text;
        dateInput.value = formatDateInput(entry.date);
    }

    function formatDateInput(dateString) {
        const parsedDate = new Date(dateString);
        return parsedDate.toISOString().split('T')[0]; // YYYY-MM-DD
    }

    function formatDateDisplay(inputValue) {
        const date = new Date(inputValue);
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }

    addEntryBtn.addEventListener('click', () => {
        const newEntry = {
            date: formatDateDisplay(new Date().toISOString()),
            text: ''
        };
        entries.unshift(newEntry);
        renderEntryList();
        loadEntry(0);
    });

    saveBtn.addEventListener('click', () => {
        if (activeIndex === null) return;
        entries[activeIndex].text = textEditor.value;
        entries[activeIndex].date = formatDateDisplay(dateInput.value);
        renderEntryList();
    });

    function renderEntryList() {
    entryList.innerHTML = '';
    entries.forEach((entry, index) => {
        const li = document.createElement('li');
        li.className = 'entry-item';

        // --- New logic: only show first 10 words with 'read more' if longer ---
        const previewWords = entry.text.split(" ").slice(0, 10).join(" ");
        const previewText = entry.text.split(" ").length > 10
            ? previewWords + ' <span class="read-more">...read more</span>'
            : previewWords;

        li.innerHTML = `
            <div class="entry-date">${entry.date}</div>
            <div class="entry-preview">${previewText}</div>
        `;

        li.addEventListener('click', () => loadEntry(index));
        entryList.appendChild(li);
    });
}


    deleteBtn.addEventListener('click', () => {
        if (activeIndex === null) return;
        entries.splice(activeIndex, 1);
        activeIndex = null;
        renderEntryList();
        textEditor.value = '';
        dateInput.value = '';
    });


// truncate the Preview words
document.querySelectorAll('.entry-preview').forEach(preview => {
        const fullText = preview.innerText;
        const words = fullText.split(' ');
        if (words.length > 10) {
            const shortText = words.slice(0, 10).join(' ') + '...read more';
            preview.innerText = shortText;
        }
    });