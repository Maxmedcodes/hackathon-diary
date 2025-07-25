import { fetchEntries, createEntry, updateEntry, deleteEntry, searchEntries, getEntryDetails } from './backendapi.js';

const entryList = document.querySelector('.entry-list');
const addEntryBtn = document.querySelector('.add-entry-btn');
const saveBtn = document.querySelector('.btn-save');
const deleteBtn = document.querySelector('.btn-delete');
const detailsBtn = document.querySelector('.btn-details');
const dateInput = document.querySelector('.date-input');
const textEditor = document.querySelector('.text-editor');
const searchBtn = document.querySelector('.search-btn');
const clearSearchBtn = document.querySelector('.clear-search-btn');
const searchDate = document.querySelector('.search-date');
const searchCategory = document.querySelector('.search-category');
const searchInfo = document.querySelector('.search-info');

let entries = [];
let activeEntry = null;
let isSearchMode = false;

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

function formatDateForSearch(dateString) {
   
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
}


searchBtn.addEventListener('click', async () => {
    const date = searchDate.value;
    const category = searchCategory.value.trim();
    
    if (!date && !category) {
        alert('Please enter a date or category to search');
        return;
    }
    
    try {
        let searchParam;
        let searchType;
        
        if (date && category) {
            alert('Please search by either date OR category, not both');
            return;
        }
        
        if (date) {
            searchParam = formatDateForSearch(date);
            searchType = `date: ${formatDateDisplay(date)}`;
        } else {
            searchParam = category;
            searchType = `category: ${category}`;
        }
        
        const searchResults = await searchEntries(searchParam);
        entries = searchResults;
        isSearchMode = true;
        renderEntryList();
        showSearchInfo(`Found ${searchResults.length} entries for ${searchType}`);
        console.log('Search results:', searchResults);
    } catch (error) {
        console.error('Error searching entries:', error);
        showSearchInfo('No entries found for your search criteria');
        entries = [];
        renderEntryList();
    }
});

clearSearchBtn.addEventListener('click', async () => {
    searchDate.value = '';
    searchCategory.value = '';
    isSearchMode = false;
    hideSearchInfo();
    await loadEntriesFromBackend();
});

function showSearchInfo(message) {
    searchInfo.textContent = message;
    searchInfo.style.display = 'block';
}

function hideSearchInfo() {
    searchInfo.style.display = 'none';
}


detailsBtn.addEventListener('click', async () => {
    if (!activeEntry) {
        alert('Please select an entry to view details');
        return;
    }
    
    try {
        const entryDetails = await getEntryDetails(activeEntry.id);
        const detailsText = `
        Entry Details:
        ═════════════════
        ID: ${entryDetails.id}
        Title: ${entryDetails.title}
        Category: ${entryDetails.category}
        Created: ${formatDateDisplay(entryDetails.createdAt)}

        Content:
        ${entryDetails.content}
        `;
        
        
        alert(detailsText);
        console.log('Entry details:', entryDetails);
    } catch (error) {
        console.error('Error fetching entry details:', error);
        alert('Failed to load entry details');
    }
});

addEntryBtn.addEventListener('click', async () => {
    const newEntry = {
        title: `Entry ${new Date().toLocaleDateString()}`,
        content: 'Write your thoughts here...',
        category: 'general'
    };
    
    try {
        const createdEntry = await createEntry(newEntry);
        
        if (isSearchMode) {
            isSearchMode = false;
            hideSearchInfo();
            searchDate.value = '';
            searchCategory.value = '';
            await loadEntriesFromBackend();
        } else {
            entries.unshift(createdEntry);
            renderEntryList();
        }
        
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
        const message = isSearchMode ? 'No entries found for your search criteria.' : 'No entries yet. Create your first entry!';
        entryList.innerHTML = `<li class="no-entries">${message}</li>`;
        return;
    }
    
    entries.forEach((entry) => {
        const li = document.createElement('li');
        li.className = `entry-item ${isSearchMode ? 'search-result' : ''}`;
        
        const previewWords = entry.content.split(" ").slice(0, 10).join(" ");
        const previewText = entry.content.split(" ").length > 10
            ? previewWords + ' <span class="read-more">...read more</span>'
            : previewWords;

        li.innerHTML = `
            <div class="entry-date">${formatDateDisplay(entry.createdAt)}</div>
            <div class="entry-preview">${previewText}</div>
            <div class="entry-category" style="font-size: 0.75rem; color: #667eea; margin-top: 5px;">📁 ${entry.category}</div>
        `;

        li.addEventListener('click', (event) => loadEntry(entry, event)); 
        entryList.appendChild(li);
    });
}