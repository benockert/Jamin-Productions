// sets custom css variable to be used as a replacement vh unit for container sizing consistency on mobile and desktop
function setViewHeight() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

// update vh, but only when height changes
// experimented with only updating every x pixels, but was jumpy
let lastFiredHeight = window.innerHeight;
window.onresize = function (event) {
  if (event.target.innerHeight !== lastFiredHeight) {
    setViewHeight();
    lastFiredHeight = event.target.innerHeight;
  }
};

// call once on load
setViewHeight();
