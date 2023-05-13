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
