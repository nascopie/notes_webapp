import API from './api.js';

class UI {
    constructor(api) {
        this.api = api;
        this.accessToken = null;
    }

    async login(username, password) {
        try {
            const data = await this.api.login(username, password);
            this.accessToken = data.access_token;
            this.showNotesSection();
            this.fetchNotes();
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    }

    async register(username, fullName, email, password) {
        try {
            await this.api.register(username, fullName, email, password);
            alert('Registration successful! You can now log in.');
        } catch (error) {
            alert('Registration failed: ' + error.message);
        }
    }

    async createOrUpdateNote(title, content, isPrivate) {
        try {
            await this.api.createNote(title, content, isPrivate);
            this.hideCreateNoteForm();
            this.fetchNotes();
        } catch (error) {
            alert('Failed to save note: ' + error.message);
        }
    }

    async fetchNotes() {
        try {
            const notes = await this.api.getNotes();
            this.renderNotes(notes);
        } catch (error) {
            alert('Failed to fetch notes: ' + error.message);
        }
    }

    async deleteNote(noteId) {
        try {
            await this.api.deleteNote(noteId);
            this.fetchNotes();
        } catch (error) {
            alert('Failed to delete note: ' + error.message);
        }
    }

    async fetchLogs() {
        try {
            const logs = await this.api.fetchLogs();
            this.renderLogs(logs);
        } catch (error) {
            alert('Failed to fetch logs: ' + error.message);
        }
    }

    showNotesSection() {
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('notes-section').style.display = 'block';
    }

    showCreateNoteForm() {
        document.getElementById('create-note-form').style.display = 'block';
    }

    hideCreateNoteForm() {
        document.getElementById('create-note-form').style.display = 'none';
    }

    renderNotes(notes) {
        const notesList = document.getElementById('notes-list');
        notesList.innerHTML = '';
        notes.forEach(note => {
            const noteCard = document.createElement('div');
            noteCard.className = 'card mb-3';
            noteCard.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${note.title}</h5>
                    <p class="card-text">${note.content}</p>
                    <button class="btn btn-warning" onclick="ui.showEditNoteForm(${note.id}, '${note.title}', '${note.content}', ${note.is_private})">Edit</button>
                    <button class="btn btn-danger" onclick="ui.deleteNote(${note.id})">Delete</button>
                </div>
            `;
            notesList.appendChild(noteCard);
        });
    }

    renderLogs(logs) {
        const logsList = document.getElementById('logs-list');
        logsList.innerHTML = '';
        logs.forEach(log => {
            const logItem = document.createElement('div');
            logItem.className = 'log-item';
            logItem.innerHTML = `
                <p><strong>${log.timestamp}</strong>: ${log.method} ${log.endpoint} - ${log.status_code}</p>
            `;
            logsList.appendChild(logItem);
        });
    }

    showEditNoteForm(id, title, content, isPrivate) {
        document.getElementById('note-title').value = title;
        document.getElementById('note-content').value = content;
        document.getElementById('note-private').checked = isPrivate;
        document.getElementById('note-form').onsubmit = (e) => {
            e.preventDefault();
            this.createOrUpdateNote(title, content, isPrivate);
        };
        this.showCreateNoteForm();
    }
}

export default UI;
