import { fetchEntries, createEntry, updateEntry, deleteEntry } from './backendapi.js';

const entryList = document.querySelector('.entry-list');
const addEntryBtn = document.querySelector('.add-entry-btn');
const saveBtn = document.querySelector('.btn-save');
const deleteBtn = document.querySelector('.btn-delete');
const dateInput = document.querySelector('.date-input');
const textEditor = document.querySelector('.text-editor');

let entries = [];
let activeEntry = null;


document.addEventListener('DOMContentLoaded', async () => {
    await loadEntriesFromBackend();
});

async function loadEntriesFromBackend() {
    try {
        entries = await fetchEntries();
        renderEntryList();
        console.log('Entries loaded successfully:', entries);
    } catch (error) {
        console.error('Error loading entries:', error);
        entries = [];
        renderEntryList();
    }
}

function loadEntry(entry, clickEvent = null) { 
    activeEntry = entry;
    textEditor.value = entry.content || '';
    dateInput.value = formatDateForInput(entry.createdAt);
    
    
    document.querySelectorAll('.entry-item').forEach(item => {
        item.classList.remove('active');
    });
    
    if (clickEvent && clickEvent.target) {
        clickEvent.target.closest('.entry-item').classList.add('active');
    } else {
        const entryItems = document.querySelectorAll('.entry-item');
        entryItems.forEach((item, index) => {
            if (entries[index] && entries[index].id === entry.id) {
                item.classList.add('active');
            }
        });
    }
}

function formatDateForInput(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

function formatDateDisplay(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

addEntryBtn.addEventListener('click', async () => {
    const newEntry = {
        title: `Entry ${new Date().toLocaleDateString()}`,
        content: 'Write your thoughts here...',
        category: 'general'
    };
    
    try {
        const createdEntry = await createEntry(newEntry);
        entries.unshift(createdEntry);
        renderEntryList();
        loadEntry(createdEntry); 
        console.log('Entry created successfully:', createdEntry);
    } catch (error) {
        console.error('Error creating entry:', error);
        alert('Failed to create entry. Please try again.');
    }
});

saveBtn.addEventListener('click', async () => {
    if (!activeEntry) {
        alert('Please select an entry to save.');
        return;
    }
    
    const updatedData = {
        content: textEditor.value
    };
    
    try {
        const updatedEntry = await updateEntry(activeEntry.id, updatedData);
        const index = entries.findIndex(e => e.id === activeEntry.id);
        if (index !== -1) {
            entries[index] = updatedEntry;
            activeEntry = updatedEntry;
            renderEntryList();
        }
        alert('Entry saved successfully!');
        console.log('Entry updated successfully:', updatedEntry);
    } catch (error) {
        console.error('Error saving entry:', error);
        alert('Failed to save entry. Please try again.');
    }
});

deleteBtn.addEventListener('click', async () => {
    if (!activeEntry) {
        alert('Please select an entry to delete.');
        return;
    }
    
    if (!confirm('Are you sure you want to delete this entry?')) return;
    
    try {
        await deleteEntry(activeEntry.id);
        entries = entries.filter(e => e.id !== activeEntry.id);
        activeEntry = null;
        textEditor.value = '';
        dateInput.value = '';
        renderEntryList();
        alert('Entry deleted successfully!');
        console.log('Entry deleted successfully');
    } catch (error) {
        console.error('Error deleting entry:', error);
        alert('Failed to delete entry. Please try again.');
    }
});

function renderEntryList() {
    entryList.innerHTML = '';
    
    if (entries.length === 0) {
        entryList.innerHTML = '<li class="no-entries">No entries yet. Create your first entry!</li>';
        return;
    }
    
    entries.forEach((entry) => {
        const li = document.createElement('li');
        li.className = 'entry-item';
        
        const previewWords = entry.content.split(" ").slice(0, 10).join(" ");
        const previewText = entry.content.split(" ").length > 10
            ? previewWords + ' <span class="read-more">...read more</span>'
            : previewWords;

        li.innerHTML = `
            <div class="entry-date">${formatDateDisplay(entry.createdAt)}</div>
            <div class="entry-preview">${previewText}</div>
        `;

        li.addEventListener('click', (event) => loadEntry(entry, event)); 
        entryList.appendChild(li);
    });
}
    