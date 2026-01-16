// Select all mega menu list items and target items with the data-slider attribute
const navItems = document.querySelectorAll('.wt-page-nav-mega__list li a');
const megaMenuItems = document.querySelectorAll('.mega-menu-image-list li');
const defaultImage = document.querySelector('.mega-menu-image-list .slider_initial');

let lastActiveImage = defaultImage;
let hoverTimeout;
let isAnimating = false; // Track animation status

navItems.forEach(navItem => {
  navItem.addEventListener('mousemove', function () {
    if (hoverTimeout) clearTimeout(hoverTimeout);

    hoverTimeout = setTimeout(() => {
      if (isAnimating) return; // Don't interrupt animation

      const dataSlider = this.closest('li').getAttribute('data-slider'); // Get from <li>

      if (dataSlider) {
        isAnimating = true; // Block further hovers until transition completes

        megaMenuItems.forEach(menuItem => {
          if (menuItem.classList.contains(dataSlider)) {
            menuItem.classList.remove('active-slider-previous');
            menuItem.classList.add('active-slider');
            lastActiveImage = menuItem;
          } else {
            menuItem.classList.remove('active-slider');
            menuItem.classList.add('active-slider-previous');
          }
        });

        if (defaultImage.classList.contains('active-slider')) {
          defaultImage.classList.remove('active-slider');
          defaultImage.classList.add('active-slider-previous');
        }

        // Wait for transition to complete before allowing new hovers
        setTimeout(() => {
          isAnimating = false;
        }, 400); // Adjust this to match your CSS transition duration
      }
    }, 200); // Cursor must stop for 200ms before triggering change
  });
});

// Restore default image smoothly when leaving menu
document.querySelector('.wt-page-nav-mega__list').addEventListener('mouseleave', function () {
  if (hoverTimeout) clearTimeout(hoverTimeout);

  if (lastActiveImage) {
    lastActiveImage.classList.remove('active-slider');
    lastActiveImage.classList.add('active-slider-previous');
  }

  defaultImage.classList.remove('active-slider-previous');
  defaultImage.classList.add('active-slider');

  lastActiveImage = defaultImage;
});




// Added the script for adding margin-top for the menu drawer in desktop view
function updateDrawerMargin() {
    let header = document.querySelector("#header");
    let announcement = document.querySelector(".wt-announcement");
    let drawerNav = document.querySelector(".wt-drawer--nav.wt-drawer--mobile-nav");

    if (header && announcement && drawerNav) {
        let headerHeight = header.offsetHeight || 0;
        let announcementHeight = announcement.offsetHeight || 0;
        let totalHeight = headerHeight + announcementHeight;

        if (window.innerWidth >= 1200) {
            drawerNav.style.marginTop = totalHeight + "px";
        } else {
            drawerNav.style.marginTop = "";
        }
    }
}

// Function to check the announcement bar is available when we scroll the page.
function handleScroll() {
    let announcement = document.querySelector(".wt-announcement");

    if (window.innerWidth >= 1200) {
        if (announcement && announcement.getBoundingClientRect().bottom <= 0) {
            document.querySelector(".wt-drawer--nav.wt-drawer--mobile-nav").style.marginTop =
                document.querySelector("#header").offsetHeight + "px";
        } else {
            updateDrawerMargin();
        }
    }
}

// Script to close the menu when we click outside of the menu (without hamburger and localization icons)
function updateDesktopMenuDrawer(){
  if (window.innerWidth >= 1200) {
    let header = document.querySelector("#header");
    let menuTrigger = document.querySelector(".wt-header__icon.wt-header__menu-trigger");
    let localizationForms = document.querySelectorAll("#header .localization-form");
  
    header.addEventListener("click", function (event) {
      // Ignore clicks on the menu trigger
      if (event.target === menuTrigger || menuTrigger.contains(event.target)) {
          return;
      }
  
      // Ignore clicks on any localization form
      for (let form of localizationForms) {
        if (form.contains(event.target)) {
          return;
        }
      }
  
      // Remove menu-open if it exists
      if (document.body.classList.contains("menu-open")) {
        document.body.classList.remove("menu-open", "menu-drawer-overlay-on");
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
    updateDrawerMargin();
    updateDesktopMenuDrawer();
});

window.addEventListener("resize", function () {
    updateDrawerMargin();
    updateDesktopMenuDrawer();
});

window.addEventListener("scroll", handleScroll);