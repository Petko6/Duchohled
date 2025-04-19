// Selects the video and home section elements
const video = document.getElementById("home-video");
const home = document.getElementById("home");

// Mutes the video to enable autoplay (browsers often block unmuted autoplay)
video.muted = true; // pro autoplay

// Checks if the browser supports HLS (HTTP Live Streaming) for Apple devices
if (video.canPlayType("application/vnd.apple.mpegurl")) {
  // Sets the video source to an HLS playlist
  video.src = "./media/video/hls/master.m3u8";
  // Specifies the MIME type for HLS
  video.setAttribute("type", "application/vnd.apple.mpegurl");
  // Attempts to autoplay the video, logging errors if it fails
  video.play().catch((err) => console.warn("Autoplay selhal:", err));

  // Re-attempts autoplay when the video is ready to play
  video.addEventListener("canplay", () => {
    video.play().catch((err) => console.warn("Autoplay selhal:", err));
  });
  // Checks if the browser supports WebM with VP9 codec for DASH streaming
} else if (MediaSource.isTypeSupported('video/webm; codecs="vp9"')) {
  // Initializes a DASH.js player for adaptive streaming
  const player = dashjs.MediaPlayer().create();
  // Commented-out: Removes background from home section (likely for testing)
  // home.style.background = "none";
  // Sets up the DASH player with a manifest file and enables autoplay
  player.initialize(video, "./media/video/dash/manifest.mpd", true);
  // Logs a warning if neither HLS nor VP9 is supported
} else {
  console.warn("Prohlížeč nepodporuje HEVC ani VP9.");
}

// Creates an IntersectionObserver to pause/play the video based on visibility
const observer = new IntersectionObserver(
  (entries) => {
    // Iterates over observed entries
    entries.forEach((entry) => {
      // Plays the video if it’s at least 10% visible
      if (entry.isIntersecting) {
        video.play();
        // Pauses the video if it’s not visible
      } else {
        video.pause();
      }
    });
  },
  { threshold: 0.1 } // Triggers when 10% of the video is visible
);

// Observes the video element for visibility changes
observer.observe(video);

// Selects the fullscreen button and video wrapper elements
const fullscreenButton = document.getElementById("fullscreen-button");
const videoWrap = document.getElementById("video-wrap");

// Defines a function to toggle fullscreen mode
const toggleFullscreen = (enter) => {
  // Enters fullscreen mode
  if (enter) {
    // Uses standard fullscreen API if available
    if (videoWrap.requestFullscreen) {
      videoWrap
        .requestFullscreen()
        .catch((err) =>
          console.error("Nepodařilo se přejít do fullscreen:", err)
        );
      // Fallback for Safari iOS
    } else if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
    }
    // Exits fullscreen mode
  } else {
    // Uses standard exit fullscreen API
    if (document.exitFullscreen) {
      document
        .exitFullscreen()
        .catch((err) => console.error("Chyba při opuštění fullscreen:", err));
      // Fallback for Safari
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
};

// Checks if the page is in fullscreen mode (cross-browser)
const isFullscreen = () => {
  // Returns true if any fullscreen element exists
  return (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
};

// Adds click event listener to the fullscreen button
fullscreenButton.addEventListener("click", () => {
  // Toggles the fullscreen-active class for styling
  fullscreenButton.classList.toggle("fullscreen-active");
  // If in fullscreen, exits and mutes the video
  if (isFullscreen()) {
    toggleFullscreen(false);
    video.muted = true;
    // If not in fullscreen, enters and unmutes the video
  } else {
    toggleFullscreen(true);
    video.muted = false;
  }
});

// Defines a function to handle fullscreen exit
const handleFullscreenExit = (event) => {
  // Mutes the video and removes fullscreen-active class if not in fullscreen
  if (
    !document.fullscreenElement &&
    !document.mozFullScreenElement &&
    !document.msFullscreenElement
  ) {
    video.muted = true;
    fullscreenButton.classList.remove("fullscreen-active");
  }
};

// Adds listeners for fullscreen change events across browsers
["fullscreenchange", "mozfullscreenchange", "msfullscreenchange"].forEach(
  (eventName) => {
    document.addEventListener(eventName, handleFullscreenExit);
  }
);

// Handles iOS-specific fullscreen exit event
video.addEventListener("webkitendfullscreen", () => {
  // Mutes and pauses the video
  video.muted = true;
  video.pause();
  // Removes fullscreen-active class
  fullscreenButton.classList.remove("fullscreen-active");

  // Stores the current video playback position
  const lastTime = video.currentTime;

  // Attempts to resume playback at the same position
  requestAnimationFrame(() => {
    video.currentTime = lastTime;
    let playPromise = video.play();
    // Handles playback promise (if defined)
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Waits for the video to be ready if playback fails
        video.addEventListener("canplay", () => {
          video
            .play()
            .catch((err) =>
              console.warn("Nepodařilo se znovu přehrát video:", err)
            );
        });
      });
    }
  });
});
