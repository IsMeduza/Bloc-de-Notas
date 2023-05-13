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
  