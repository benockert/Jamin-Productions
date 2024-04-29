window.addEventListener("load", (event) => {
  // get all of the images we want to cycle through
  const banners = document.getElementsByClassName("banner-image");

  // set our initial current and next banners (current is first one in html file referencing this script; should be initialized with opacity 1)
  let index = 0;
  let current_banner = banners[index];
  let next_banner = banners[(index + 1) % banners.length];

  // set current to opaque just in case first element in banners list is not expected image
  current_banner.style.opacity = 1;

  setInterval(() => {
    // fade out current and fade in next (transition speed is set in html file that references this script)
    current_banner.style.opacity = 0;
    next_banner.style.opacity = 1;

    // update our current and next pointer
    current_banner = next_banner;
    next_banner = banners[(index + 2) % banners.length];
    index += 1;
  }, 30000);
});
