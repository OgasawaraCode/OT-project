window.addEventListener("scroll", function() {
    const pageTopBtn = document.querySelector(".top");
    
    if (window.scrollY >= 100) {
        pageTopBtn.classList.add("is-display");
    } else {
        pageTopBtn.classList.remove("is-display");
    }
});

let mouseTimeout;
const hideDelay = 1000;

function hideControls() {
    const modal = document.getElementById("videoModal");
    if (modal && modal.hasAttribute("data-playing")) {
        modal.classList.add("hide-controls");
    }
}

function resetControlTimer() {
    const modal = document.getElementById("videoModal");
    if (!modal) return;

    modal.classList.remove("hide-controls");

    clearTimeout(mouseTimeout);
    mouseTimeout = setTimeout(hideControls, hideDelay);
}

function openModal() {
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("tabgen-Video");

  if (!modal || !video) return;

  modal.style.display = 'flex';
  modal.setAttribute("data-playing", "");
  modal.removeAttribute("data-paused");
  video.currentTime = 0;
  video.play();

  resetControlTimer();
  modal.addEventListener("mousemove", resetControlTimer);
  modal.addEventListener("touchstart", resetControlTimer);
}

function closeModal(event) {
  if (event.target.classList.contains("modal-background") || event.target.classList.contains("modal-close-btn")) {
    const modal = document.getElementById("videoModal");
    const video = document.getElementById("tabgen-Video");

    if (modal && video) {
      modal.style.display = "none";
      video.pause();
      
      clearTimeout(mouseTimeout);
      modal.removeEventListener("mousemove", resetControlTimer);
      modal.removeEventListener("touchstart", resetControlTimer);
      modal.classList.remove("hide-controls");
    }
  }
}

function toggleVideo(event) {
  if (event) event.stopPropagation();
  
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("tabgen-Video");

  if (!modal || !video) return;
  if (video.paused || modal.hasAttribute("data-paused")) {
    modal.setAttribute("data-playing", "");
    modal.removeAttribute("data-paused");
    video.play();
    resetControlTimer();
  } else {
    modal.setAttribute("data-paused", "");
    modal.removeAttribute("data-playing");
    video.pause();
    
    clearTimeout(mouseTimeout);
    modal.classList.remove("hide-controls");
  }
}