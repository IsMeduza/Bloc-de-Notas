Estoy programando una extension para chrome y quiero que empiezes con borrar los codigos que sobren y que hagas que todo sea funcional:
Estructura i Codigo:
icons
-icon16
-icon48
-icon128
-theme-toggle.png
popup
-index.html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Bloc de notes ràpid</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <header>
      <h1>Bloc de Notes</h1>
      <div id="theme-toggle">
        <img src="../icons/theme-toggle.png" alt="Canviar tema">
      </div>
    </header>
    <div id="note-controls">
      <button id="new-note">Nova nota</button>
      <button id="delete-note">Eliminar nota</button>
    </div>
    <div id="notes-list"></div>
    <textarea id="note-textarea" placeholder="Escriu les teves notes aquí..."></textarea>
    <div id="stats">
      <div class="stat-item">
        <strong>Paraules:</strong> <span id="word-count">0</span>
      </div>
      <div class="stat-item">
        <strong>Caràcters:</strong> <span id="character-count">0</span>
      </div>
    </div>
    <button id="save-button">Desa</button>
    <script src="../background.js"></script>
    <script src="theme.js"></script>
    <script src="stats.js"></script>
    <script src="notes.js"></script>
  </body>
</html>

-notes.js
const notesList = document.getElementById('notes-list');
const noteTextarea = document.getElementById('note-textarea');
const saveButton = document.getElementById('save-button');
const newNoteButton = document.getElementById('new-note');
const deleteNoteButton = document.getElementById('delete-note');

let notes = [];
let selectedNoteIndex = 0;

function loadNotes() {
  chrome.storage.local.get('notes', (result) => {
    notes = result.notes || [];
    if (notes.length === 0) {
      notes.push('');
    }
    renderNotesList();
    displaySelectedNote();
  });
}

function saveNotes() {
  chrome.storage.local.set({ notes });
}

function renderNotesList() {
  notesList.innerHTML = '';
  notes.forEach((note, index) => {
    const noteElement = document.createElement('div');
    noteElement.classList.add('note');
    if (index === selectedNoteIndex) {
      noteElement.classList.add('selected');
    }
    noteElement.textContent = note.slice(0, 10) + (note.length > 10 ? '...' : '');
    noteElement.addEventListener('click', () => {
      selectedNoteIndex = index;
      renderNotesList();
      displaySelectedNote();
    });
    notesList.appendChild(noteElement);
  });
}

function displaySelectedNote() {
  noteTextarea.value = notes[selectedNoteIndex];
  updateStats();
}

function saveCurrentNote() {
  notes[selectedNoteIndex] = noteTextarea.value;
  saveNotes();
  renderNotesList();
}

function addNewNote() {
  notes.push('');
  selectedNoteIndex = notes.length - 1;
  renderNotesList();
  displaySelectedNote();
}

function deleteSelectedNote() {
  if (notes.length > 1) {
    notes.splice(selectedNoteIndex, 1);
    selectedNoteIndex = Math.max(0, selectedNoteIndex - 1);
    renderNotesList();
    displaySelectedNote();
    saveNotes();
  } else {
    alert('No es pot eliminar l\'última nota');
  }
}

saveButton.addEventListener('click', saveCurrentNote);
newNoteButton.addEventListener('click', addNewNote);
deleteNoteButton.addEventListener('click', deleteSelectedNote);

loadNotes();

-stats.js
const noteTextarea = document.getElementById('note-textarea');
const wordCount = document.getElementById('word-count');
const characterCount = document.getElementById('character-count');

function updateStats() {
  const text = noteTextarea.value.trim();
  const words = text === '' ? 0 : text.split(/\s+/).length;
  const characters = text.length;
  
  wordCount.textContent = `${words}`;
  characterCount.textContent = `${characters}`;
}

noteTextarea.addEventListener('input', updateStats);

-styles.css
body {
  width: 300px;
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 10px;
  transition: background-color 0.3s, color 0.3s;
}

body.dark {
  background-color: #333;
  color: #eee;
}

body.dark button {
  background-color: #444;
  color: #eee;
}

body.dark button:hover {
  background-color: #222;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

h1 {
  margin: 0;
  font-size: 20px;
}

textarea {
  width: 100%;
  height: 200px;
  resize: none;
  background-color: inherit;
  color: inherit;
  border: 1px solid;
  padding: 5px;
  box-sizing: border-box;
  transition: background-color 0.3s, color 0.3s;
}

#word-count {
  margin: 5px 0;
}

button {
  width: 100%;
  background-color: #000;
  color: white;
  font-size: 14px;
  margin-top: 10px;
  padding: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #222;
}

#theme-toggle {
  cursor: pointer;
  width: 24px;
  height: 24px;
}

#theme-toggle img {
  width: 100%;
  height: 100%;
}

footer {
  margin-top: 10px;
  font-size: 12px;
}

#notes-list {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.note {
  background-color: #f0f0f0;
  border-radius: 5px;
  margin-right: 5px;
  margin-bottom: 5px;
  padding: 5px;
  cursor: pointer;
}

.note.selected {
  background-color: #c0c0c0;
}

#stats {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}

.stat-item {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
-theme.js
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.querySelector('body');
  
    chrome.storage.sync.get('theme', ({ theme }) => {
      if (theme === 'dark') {
        body.classList.add('dark');
      }
    });
  
    function toggleTheme() {
      body.classList.toggle('dark');
      const newTheme = body.classList.contains('dark') ? 'dark' : 'light';
      chrome.storage.sync.set({ theme: newTheme });
    }
  
    themeToggle.addEventListener('click', toggleTheme);
  });
  
background.js
document.addEventListener('DOMContentLoaded', () => {
    const noteTextarea = document.getElementById('note-textarea');
    const saveButton = document.getElementById('save-button');
  
    chrome.storage.sync.get('notes', ({ notes }) => {
      if (notes) noteTextarea.value = notes;
    });
  
    saveButton.addEventListener('click', () => {
      const notes = noteTextarea.value;
      chrome.storage.sync.set({ notes }, () => {
        alert('Notes desades!');
      });
    });
  });
manifest.json
{
    "manifest_version": 2,
    "name": "Bloc de notes ràpid",
    "version": "1.0",
    "description": "Prendre notes ràpides directament des del navegador",
    "icons": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    },
    "browser_action": {
      "default_icon": "icons/icon48.png",
      "default_popup": "popup/index.html",
      "default_title": "Bloc de notes ràpid"
    },
    "permissions": ["storage"]
  }
  