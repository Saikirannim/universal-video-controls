/**
 * @file content.js
 * @description This script finds and controls HTML5 video elements on any webpage.
 * It adds YouTube-like keyboard shortcuts for playback control.
 * v14 - Adds special key-remapping for Netflix to avoid conflicts.
 */

console.log("Universal Video Controls: Script injected and running (v14).");

// --- Globals ---
let activeVideo = null;
let lastActiveVideo = null;
let indicator = null;
let feedbackDisplay = null;
let indicatorTimeout = null; // Timeout for hiding the indicator

// --- Core Functions ---

/**
 * Creates a visual indicator to show that the script is active.
 */
function createIndicator() {
  const ind = document.createElement('div');
  ind.style.position = 'fixed';
  ind.style.bottom = '20px';
  ind.style.left = '20px';
  ind.style.padding = '8px 15px';
  ind.style.backgroundColor = 'rgba(20, 20, 20, 0.85)';
  ind.style.color = 'white';
  ind.style.fontFamily = 'sans-serif';
  ind.style.fontSize = '14px';
  ind.style.borderRadius = '6px';
  ind.style.zIndex = '2147483647';
  ind.style.pointerEvents = 'none';
  ind.textContent = '▶️ Universal Controls Active';
  ind.style.opacity = '0';
  ind.style.transition = 'opacity 0.5s';
  document.body.appendChild(ind);
  return ind;
}

/**
 * Creates a display for showing feedback on the video.
 */
function createFeedbackDisplay() {
    const feedback = document.createElement('div');
    feedback.style.position = 'absolute';
    feedback.style.top = '50%';
    feedback.style.left = '50%';
    feedback.style.transform = 'translate(-50%, -50%)';
    feedback.style.padding = '12px 24px';
    feedback.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
    feedback.style.color = 'white';
    feedback.style.fontFamily = 'sans-serif';
    feedback.style.fontSize = '28px';
    feedback.style.fontWeight = 'bold';
    feedback.style.borderRadius = '8px';
    feedback.style.zIndex = '2147483647';
    feedback.style.pointerEvents = 'none';
    feedback.style.opacity = '0';
    feedback.style.transition = 'opacity 0.5s ease-out';
    return feedback;
}

/**
 * Shows a feedback message over the active video.
 * @param {string} text - The message to display.
 */
function showFeedback(text) {
    if (!activeVideo || !feedbackDisplay) return;
    const parent = activeVideo.parentElement;
    if (!parent) return;
    if (feedbackDisplay.parentElement !== parent) {
        if (getComputedStyle(parent).position === 'static') {
            parent.style.position = 'relative';
        }
        parent.appendChild(feedbackDisplay);
    }
    feedbackDisplay.textContent = text;
    feedbackDisplay.style.opacity = '1';
    setTimeout(() => {
        feedbackDisplay.style.opacity = '0';
    }, 600);
}

/**
 * Scans the entire document to find the largest, most likely "main" video player.
 * @returns {HTMLVideoElement|null} The video element with the largest area.
 */
function findMainVideo() {
    let videos = [];
    function collectVideos(root) {
        root.querySelectorAll('video').forEach(v => videos.push(v));
        root.querySelectorAll('*').forEach(el => {
            if (el.shadowRoot) collectVideos(el.shadowRoot);
        });
    }
    collectVideos(document);

    const visibleVideos = videos.filter(v => {
        const rect = v.getBoundingClientRect();
        return v.offsetParent !== null && rect.width > 150 && rect.height > 150;
    });

    if (visibleVideos.length === 0) return null;

    visibleVideos.sort((a, b) => {
        const areaA = a.getBoundingClientRect().width * a.getBoundingClientRect().height;
        const areaB = b.getBoundingClientRect().width * b.getBoundingClientRect().height;
        return areaB - areaA;
    });
    
    return visibleVideos[0];
}

/**
 * Dispatches a keyboard event on the window, to be caught by the site's native player.
 * @param {string} key The key to press (e.g., 'ArrowLeft', ' ').
 */
function dispatchNativeKeyEvent(key) {
    console.log(`[UVC] Remapping to native '${key}' event.`);
    const event = new KeyboardEvent('keydown', {
        key: key,
        bubbles: true,
        cancelable: true,
    });
    window.dispatchEvent(event);
}


/**
 * Handles the 'keydown' event to control the active video.
 * @param {KeyboardEvent} e - The keyboard event object.
 */
function handleKeyDown(e) {
  const target = e.target;
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
    return;
  }

  if (!activeVideo) return;
  
  const isNetflix = window.location.hostname.includes('netflix.com');
  let handled = true;
  let feedbackText = '';

  // --- Netflix Specific Handling ---
  if (isNetflix) {
      switch (e.key.toLowerCase()) {
          case 's': case 'k':
              dispatchNativeKeyEvent(' ');
              break;
          case 'a': case 'j':
              dispatchNativeKeyEvent('ArrowLeft');
              break;
          case 'd': case 'l':
              dispatchNativeKeyEvent('ArrowRight');
              break;
          case 'm':
              dispatchNativeKeyEvent('m');
              break;
          case 'f':
              dispatchNativeKeyEvent('f');
              break;
          default:
              handled = false; // Let other keys pass through
              break;
      }
      if (handled) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
      }
      return; // End of Netflix handling
  }

  // --- Standard Handling for all other sites ---
  switch (e.key.toLowerCase()) {
    case 's':
    case 'k':
      if (activeVideo.paused) {
        activeVideo.play();
        feedbackText = '▶ Play';
      } else {
        activeVideo.pause();
        feedbackText = '❚❚ Pause';
      }
      break;
    case 'a':
        activeVideo.currentTime -= 5;
        feedbackText = '« 5s';
        break;
    case 'd':
        activeVideo.currentTime += 5;
        feedbackText = '5s »';
        break;
    case 'j': activeVideo.currentTime -= 10; feedbackText = '« 10s'; break;
    case 'l': activeVideo.currentTime += 10; feedbackText = '10s »'; break;
    case 'm':
      activeVideo.muted = !activeVideo.muted;
      feedbackText = activeVideo.muted ? '? Muted' : '🔊 Unmuted';
      break;
    case 'f':
      if (!document.fullscreenElement) {
        activeVideo.requestFullscreen().catch(err => console.warn(`Fullscreen error: ${err.message}`));
        feedbackText = '⛶ Enter Fullscreen';
      } else {
        document.exitFullscreen();
        feedbackText = 'Exit Fullscreen';
      }
      break;
    case 'arrowup': activeVideo.volume = Math.min(1, activeVideo.volume + 0.05); feedbackText = `Volume: ${Math.round(activeVideo.volume * 100)}%`; break;
    case 'arrowdown': activeVideo.volume = Math.max(0, activeVideo.volume - 0.05); feedbackText = `Volume: ${Math.round(activeVideo.volume * 100)}%`; break;
    case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9':
        const percentage = parseInt(e.key) / 10;
        activeVideo.currentTime = activeVideo.duration * percentage;
        feedbackText = `Seek to ${e.key}0%`;
        break;
    default: handled = false; break;
  }

  if (handled) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    if (feedbackText) { showFeedback(feedbackText); }
  }
}

// --- Initialization ---
function init() {
    indicator = createIndicator();
    feedbackDisplay = createFeedbackDisplay();

    setInterval(() => {
        activeVideo = findMainVideo();
        
        if (activeVideo) {
            // If we've found a new video, show the indicator temporarily.
            if (lastActiveVideo !== activeVideo) {
                indicator.style.opacity = '1';
                
                // Clear any previous timeout
                if (indicatorTimeout) clearTimeout(indicatorTimeout);
                
                // Set a new timeout to hide the indicator
                indicatorTimeout = setTimeout(() => {
                    indicator.style.opacity = '0';
                }, 3000); // Hide after 3 seconds
            }
            lastActiveVideo = activeVideo;
        } else {
            // If no video is found, make sure indicator is hidden
            indicator.style.opacity = '0';
            lastActiveVideo = null;
        }
    }, 2000);

    window.addEventListener('keydown', handleKeyDown, true);
}

if (document.readyState === 'complete') {
    init();
} else {
    window.addEventListener('load', init);
}
