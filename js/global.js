window.onscroll = function() {scrollCheck()};

// NAV SCROLL
function scrollCheck() {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        document.getElementById("nav").classList.add("on-scroll");
    } else {
        document.getElementById("nav").classList.remove("on-scroll");
    }
}

// MOBILE NAV 
function openNav() {
    document.getElementById("mobile-nav").style.width = "100%";
    document.getElementById("mobile-nav-buttons").style.display = "flex";

    var navChildren = document.getElementById('mobile-nav').children;
    for (child of navChildren) { child.style.display = 'unset' };
}

function closeNav() {
    document.getElementById("mobile-nav").style.width = "0%";
    document.getElementById("mobile-nav-buttons").style.display = "none";

    var navChildren = document.getElementById('mobile-nav').children;
    for (child of navChildren) { child.style.display = 'none' };
}