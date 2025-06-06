// RecallForge - Flashcard App with 3D Elements
// Main JavaScript functionality

// Sample flashcards for demonstration
const flashcards = [
  { front: "What is the capital of France?", back: "Paris" },
  { front: "What is the capital of Japan?", back: "Tokyo" },
  { front: "What is the capital of Brazil?", back: "Brasília" },
  { front: "What is the capital of Australia?", back: "Canberra" },
  { front: "What is the capital of Egypt?", back: "Cairo" }
];

// Initialize variables for tracking stats
let currentCardIndex = 0;
// Note: reviewed, remembered, and forgotten variables are already defined in the HTML

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the flashcard
  updateFlashcard();
  
  // Set up event listeners
  setupEventListeners();
  
  // Initialize the 3D elements
  initialize3DElements();
});

// Update the flashcard with current content
function updateFlashcard() {
  const flashcard = document.querySelector('.flashcard');
  const front = flashcard.querySelector('.front');
  const back = flashcard.querySelector('.back');
  
  front.textContent = flashcards[currentCardIndex].front;
  back.textContent = flashcards[currentCardIndex].back;
  
  // Reset the flipped state
  flashcard.classList.remove('flipped');
}

// Move to the next flashcard
function nextCard() {
  currentCardIndex = (currentCardIndex + 1) % flashcards.length;
  updateFlashcard();
}

// Update the stats display - using the global variables from HTML
function updateStats() {
  document.getElementById("reviewed").innerText = reviewed;
  document.getElementById("remembered").innerText = remembered;
  document.getElementById("forgotten").innerText = forgotten;
}

// Set up event listeners for the app
function setupEventListeners() {
  // Flashcard click to flip
  const flashcard = document.querySelector('.flashcard');
  flashcard.addEventListener('click', () => {
    flashcard.classList.toggle('flipped');
  });
  
  // FAQ toggles
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('open');
      const toggle = item.querySelector('.toggle');
      toggle.textContent = item.classList.contains('open') ? '-' : '+';
    });
  });
  
  // Settings form changes
  document.getElementById('theme-dark')?.addEventListener('change', () => applyTheme('dark'));
  document.getElementById('theme-light')?.addEventListener('change', () => applyTheme('light'));
  document.getElementById('theme-auto')?.addEventListener('change', () => applyTheme('auto'));
  
  // Enhanced navigation system
  setupNavigation();
}

// Set up the navigation system
function setupNavigation() {
  const sections = ['decks', 'stats', 'settings', 'help'];
  const mainContent = document.querySelector('.content');
  const pageTransition = document.querySelector('.page-transition');
  const navLinks = document.querySelectorAll('nav a');
  
  sections.forEach(section => {
    document.getElementById(`nav-${section}`).addEventListener('click', (e) => {
      e.preventDefault();
      
      // Add active class to clicked nav item
      navLinks.forEach(link => link.classList.remove('active'));
      e.target.classList.add('active');
      
      // Show transition screen
      pageTransition.classList.add('active');
      
      // Fade the main content
      mainContent.classList.add('faded');
      
      setTimeout(() => {
        // Hide all sections and 3D elements
        sections.forEach(s => {
          const sectionElement = document.getElementById(`section-${s}`);
          sectionElement.style.display = 'none';
          sectionElement.classList.remove('active');
          document.getElementById(`${s}-3d`).style.opacity = 0;
        });
        
        // After a slight delay, show the selected section
        setTimeout(() => {
          // Show selected section and 3D background
          const selectedSection = document.getElementById(`section-${section}`);
          selectedSection.style.display = 'block';
          
          // Force reflow to enable transition
          selectedSection.offsetHeight;
          
          selectedSection.classList.add('active');
          document.getElementById(`${section}-3d`).style.opacity = 1;
          
          // Hide transition screen
          pageTransition.classList.remove('active');
          
          // Un-fade the main content with reduced opacity
          mainContent.classList.remove('faded');
          
          // Scroll to top smoothly
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 300);
      }, 500);
    });
  });
}

// Apply theme changes
function applyTheme(theme) {
  const root = document.documentElement;
  
  if (theme === 'light') {
    root.style.setProperty('--bg-color', '#f5f5f5');
    root.style.setProperty('--text-color', '#333');
    document.body.classList.add('light-mode');
  } else {
    root.style.setProperty('--bg-color', '#000');
    root.style.setProperty('--text-color', '#e7e7e7');
    document.body.classList.remove('light-mode');
  }
}

// Initialize and manage 3D elements
function initialize3DElements() {
  // Get all 3D viewers
  const viewers = document.querySelectorAll('spline-viewer');
  
  // Make sure the main robot 3D is visible
  const mainRobot = document.querySelector('.robot-3d');
  if (mainRobot) {
    mainRobot.style.opacity = '1';
  }
  
  // Add CSS for flashcard flipping if not already in the HTML
  addFlashcardStyles();
}

// Add CSS for flashcard flipping
function addFlashcardStyles() {
  // Check if styles already exist
  if (!document.getElementById('flashcard-styles')) {
    const style = document.createElement('style');
    style.id = 'flashcard-styles';
    style.textContent = `
      .flashcard-box {
        perspective: 1000px;
        width: 100%;
        max-width: 500px;
        height: 300px;
        margin: 2rem 0;
      }
      
      .flashcard {
        width: 100%;
        height: 100%;
        position: relative;
        transition: transform 0.6s;
        transform-style: preserve-3d;
        cursor: pointer;
      }
      
      .flashcard.flipped {
        transform: rotateY(180deg);
      }
      
      .front, .back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        border-radius: 10px;
        background: #1a1a1a;
        border: 1px solid #333;
        color: white;
        font-size: 1.5rem;
        text-align: center;
      }
      
      .back {
        transform: rotateY(180deg);
        background: #2a2a2a;
      }
      
      .buttons {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
        justify-content: center;
      }
      
      .buttons button {
        cursor: pointer;
        border: none;
        border-radius: 50px;
        padding: 0.7rem 1.5rem;
        font-weight: 600;
        transition: all 0.3s ease;
      }
      
      .stats {
        text-align: center;
        margin-top: 1rem;
        color: #aaa;
      }
    `;
    document.head.appendChild(style);
  }
}

// Show a notification message
function showNotification(message) {
  // Create notification element if it doesn't exist
  let notification = document.querySelector('.notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'notification';
    document.body.appendChild(notification);
    
    // Add styles
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#9f79ff';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  }
  
  // Set message and show
  notification.textContent = message;
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 10);
  
  // Hide after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
  }, 3000);
}
