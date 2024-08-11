/* SIDE NAV */


/* Function to slide the side-nav footer */
function slideFooter() {
  const footerToggle = document.getElementById("footer-caret");
  const footer = document.querySelector(".side-nav.footer");

  let id = null;
  let initialUp = -60;
  let initialDown = 0;
  clearInterval(id);

  if (footerToggle.checked == true) {
    id = setInterval(slideUp, 10);
  } else {
    id = setInterval(slideDown, 10);
  }

  function slideUp() {

    if (initialUp == 0) {
      clearInterval(id);
    } else {
      initialUp++;
      footer.style.bottom = initialUp + "%";
    }
  }

  function slideDown() {

    if (initialDown == -60) {
      clearInterval(id);
    } else {
      initialDown--;
      footer.style.bottom = initialDown + "%";
    }
  }
}
