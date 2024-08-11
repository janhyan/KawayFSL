/* SIDE NAV */

function slideFooter() {
    var footerToggle = document.getElementById("footer-caret");
    var footer = document.querySelector(".side-nav.footer");

    console.log('test')
    if (footerToggle.checked == true) {
        console.log("Test")
        footer.style.bottom = '0%';
    } else {
        footer.style.bottom = '-60%';
    }
}
