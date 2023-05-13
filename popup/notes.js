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
