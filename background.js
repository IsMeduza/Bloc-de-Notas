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
  