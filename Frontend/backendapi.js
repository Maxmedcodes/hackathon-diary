// backendapi.js
// Handles API calls between the frontend and backend for diary CRUD operations

const API_BASE_URL = 'http://localhost:3000/api/diary'; 

// Fetch all diary entries
export async function fetchEntries() {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error('Failed to fetch entries');
    return response.json();
}

// Create a new diary entry
export async function createEntry(entry) {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
    });
    if (!response.ok) throw new Error('Failed to create entry');
    return response.json();
}

// Update an existing diary entry by ID
export async function updateEntry(id, entry) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
    });
    if (!response.ok) throw new Error('Failed to update entry');
    return response.json();
}

// Delete a diary entry by ID
export async function deleteEntry(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete entry');
    return response.json();
}
