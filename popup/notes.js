const saveButton = document.getElementById('save-button');
let notes = [];
let selectedNoteIndex = 0;

function saveNotes() {
  chrome.storage.local.set({ notes });
}

saveButton.addEventListener('click', saveCurrentNote);

loadNotes();
