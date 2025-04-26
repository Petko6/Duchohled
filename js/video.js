// Prevent a function from being called too frequently by adding a delay
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

// Select the video, fullscreen button, and video container elements from the webpage
const video = document.getElementById("home-video");
const fullscreenButton = document.getElementById("fullscreen-button");
const videoWrap = document.getElementById("video-wrap");

// Mute the video to allow autoplay on page load
video.muted = true;

// Initialize Shaka Player (a video streaming library) if available
let shakaPlayer = null;
if (window.shaka) {
  shakaPlayer = new shaka.Player();
}

// Check if the browser supports native HLS (a video streaming format)
function isHlsSupported() {
  const video = document.createElement("video");
  const supported = !!video.canPlayType("application/vnd.apple.mpegurl");
  return supported;
}

// Configure Shaka Player with settings for smooth streaming
function configurePlayer(player) {
  player.configure({
    streaming: {
      bufferingGoal: 60, // Buffer up to 60 seconds of video
      rebufferingGoal: 2, // Try to rebuffer for 2 seconds if interrupted
      bufferBehind: 30, // Keep 30 seconds of video behind the current time
    },
  });
}

// Play a video using Shaka Player with a given streaming URL
async function playWithShaka(manifestUri) {
  if (!window.shaka) {
    throw new Error("Shaka Player is not available");
  }
  const player = shakaPlayer || new shaka.Player();
  await player.attach(video);
  await player.load(manifestUri);
  configurePlayer(player);
  video.play().catch((err) => {});
  return player;
}

// Set up an observer to pause/play the video based on visibility
function setupObserver() {
  const observer = new IntersectionObserver(
    debounce((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video.play().catch((err) => {});
        } else {
          video.pause();
        }
      });
    }, 100), // Delay to avoid rapid play/pause
    { threshold: 0.2 } // Trigger when 20% of the video is visible
  );
  observer.observe(video);
}

// Toggle fullscreen mode for the video
function toggleFullscreen(enter) {
  if (enter) {
    if (videoWrap.requestFullscreen) {
      videoWrap.requestFullscreen().catch((err) => {});
    } else if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch((err) => {});
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

// Check if the video is currently in fullscreen mode
function isFullscreen() {
  const fullscreen = !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
  return fullscreen;
}

// Add a click listener to the fullscreen button to toggle fullscreen mode
fullscreenButton.addEventListener("click", () => {
  const enter = !isFullscreen();
  toggleFullscreen(enter);
  if (enter) {
    video.muted = false; // Unmute video in fullscreen
    fullscreenButton.classList.add("fullscreen-active"); // Update button style
  } else {
    video.muted = true; // Mute video when exiting fullscreen
    fullscreenButton.classList.remove("fullscreen-active"); // Update button style
  }
});

// Handle exiting fullscreen mode
function handleFullscreenExit() {
  if (!isFullscreen()) {
    video.muted = true; // Mute video when fullscreen is exited
    fullscreenButton.classList.remove("fullscreen-active"); // Update button style
  }
}

// Add listeners for fullscreen change events across different browsers
[
  "fullscreenchange",
  "webkitfullscreenchange",
  "mozfullscreenchange",
  "msfullscreenchange",
].forEach((eventName) => {
  document.addEventListener(eventName, handleFullscreenExit);
});

// Handle iOS-specific fullscreen exit behavior
video.addEventListener("webkitendfullscreen", () => {
  video.muted = true; // Mute video when exiting fullscreen
  const lastTime = video.currentTime; // Save current video time
  requestAnimationFrame(() => {
    video.currentTime = lastTime; // Restore video time
    video.play().catch((err) => {});
  });
});

// Set up video playback based on browser capabilities
async function setupPlayback() {
  try {
    if (isHlsSupported()) {
      video.src = "./media/video/hls/master.m3u8"; // Set HLS video source
      video.setAttribute("type", "application/vnd.apple.mpegurl"); // Specify HLS type
      await video.play(); // Start playback
    } else if (MediaSource.isTypeSupported('video/webm; codecs="vp9"')) {
      await playWithShaka("./media/video/dash/manifest.mpd"); // Play DASH with Shaka
    } else {
      await playWithShaka("./media/video/hls/master.m3u8"); // Play HLS with Shaka
    }
  } catch (err) {
    if (video.canPlayType("video/mp4; codecs=hevc,aac")) {
      video.src = "./media/video/hls/master_mp4.m3u8"; // Set MP4 HLS source
      video.setAttribute("type", "application/x-mpegURL"); // Specify MP4 HLS type
      await video.play().catch((err) => {});
    }
  }
}

// Start video playback and set up the visibility observer once playing
setupPlayback().then(() => {
  video.addEventListener(
    "playing",
    () => {
      setupObserver(); // Start observing video visibility
    },
    { once: true } // Only run once when the video starts playing
  );
});
