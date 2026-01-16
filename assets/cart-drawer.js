class CartDrawerSection extends HTMLElement {
  cartUpdateUnsubscriber = undefined;
  constructor() {
    super();

    this.cartType = this.dataset.cartType;
    this.drawerClass = "wt-cart__drawer";
    this.drawer = this.querySelector(`.${this.drawerClass}`);
    this.classDrawerActive = `${this.drawerClass}--open`;
    this.pageOverlayClass = "page-overlay-cart";
    this.activeOverlayBodyClass = `${this.pageOverlayClass}-on`;
    this.body = document.body;
    this.triggerQuery = [
      `.wt-cart__trigger`,
      `.wt-cart__back-link`,
      `.${this.pageOverlayClass}`,
    ].join(", ");
    this.triggers = () => document.querySelectorAll(this.triggerQuery);
    this.isOpen = false;
    this.isCartPage = window.location.pathname.includes("cart");
    this.closeButton = () => this.querySelector(".wt-cart__drawer__close");
    this.mainTrigger = document.querySelector(".wt-cart__trigger");
    this.toggleEelements = () =>
      this.querySelectorAll(this.dataset.toggleTabindex);
  }

  connectedCallback() {
   
    if (this.cartType === "page" || this.isCartPage) return;

    this.init();
    this.cartUpdateUnsubscriber = subscribe(PUB_SUB_EVENTS.cartUpdate, () => {
      if (this.isOpen) {
        setTabindex(this.toggleEelements(), "0");
        this.closeButton().focus();
      }
    });
  }

  disconnectedCallback() {
    if (this.cartUpdateUnsubscriber) {
      this.cartUpdateUnsubscriber();
    }
  }

  getFocusableElements() {
    const focusableElementsSelector =
      "button, [href], input, select, [tabindex]";
    const focusableElements = () =>
      Array.from(this.querySelectorAll(focusableElementsSelector)).filter(
        (el) => !el.hasAttribute("disabled") && el.tabIndex >= 0,
      );

    return {
      focusableElements,
      first: focusableElements()[0],
      last: focusableElements()[focusableElements().length - 1],
    };
  }

  temporaryHideFocusVisible() {
    document.body.classList.add("no-focus-visible");
  }

  onToggle() {
    if (this.hasAttribute("open")) {
      this.removeAttribute("open");
      this.isOpen = false;
      this.mainTrigger.focus();
      this.temporaryHideFocusVisible();
      setTabindex(this.toggleEelements(), "-1");
    } else {
      this.setAttribute("open", "");
      this.isOpen = true;
      this.closeButton().focus();
      this.temporaryHideFocusVisible();
      setTabindex(this.toggleEelements(), "0");
      // ⬇️ Added by ocs New addition to refresh cart data
      this.fetchAndRenderUpdatedCart();
    }
  }

   async fetchAndRenderUpdatedCart() {
    try {
      const subtotalValueEl = document.querySelector('.wt-cart__subtotal__value');
      const subtotalLoaderEl = document.querySelector('.wt-cart__subtotal__loader');
  
      // Show loader, hide value
      if (subtotalValueEl && subtotalLoaderEl) {
        subtotalValueEl.style.display = 'none';
        subtotalLoaderEl.style.display = 'block';
      }
  
      // Step 1: Force Shopify to refresh cart backend state
      await this.forceCartRecalculation();
  
      // Step 2: Fetch refreshed HTML sections
      const sectionParams = this.getSectionsToRender()
        .map((section) => section.section || section.id)
        .join(",");
  
      const res = await fetch(`/cart?sections=${sectionParams}`);
      const data = await res.json();
  
      this.renderContents({ sections: data }, false); // Don't close the drawer
  
      // 🔁 Delay a bit to ensure DOM is re-rendered before showing updated subtotal
      setTimeout(() => {
        const newSubtotalValueEl = document.querySelector('.wt-cart__subtotal__value');
        const newSubtotalLoaderEl = document.querySelector('.wt-cart__subtotal__loader');
  
        if (newSubtotalValueEl && newSubtotalLoaderEl) {
          newSubtotalValueEl.style.display = 'block';
          newSubtotalLoaderEl.style.display = 'none';
        }
  
        console.log("✅ New cart data fetched after recalculation");
      }, 300); // You can adjust this to match rendering speed
    } catch (err) {
      console.error("❌ Failed to refresh cart drawer contents:", err);
    }
  }

  async forceCartRecalculation() {
    try {
      const res = await fetch('/cart.js');
      const cart = await res.json();
  
      const updates = {};
      cart.items.forEach(item => {
        updates[item.id] = item.quantity; // Same quantity, but will trigger recalculation
      });
  
      await fetch('/cart/update.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      });
    } catch (err) {
      console.error("❌ Failed to force cart recalculation:", err);
    }
  }

  toggleDrawerClasses() {
    this.onToggle();
    this.drawer.classList.toggle(this.classDrawerActive);
    this.body.classList.toggle(this.activeOverlayBodyClass);
  }



  init() {
    this.addEventListener("keydown", (e) => {
      const isTabPressed =
        e.key === "Tab" || e.keyCode === 9 || e.code === "Tab";
      const { first, last } = this.getFocusableElements();

      if (e.key === "Escape" || e.keyCode === 27 || e.code === "Escape") {
        if (this.isOpen) {
          this.toggleDrawerClasses();
        }
      }

      if (isTabPressed) {
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    });

    this.triggers().forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleDrawerClasses();
      });
    });

    this.addEventListener("click", (e) => {
      if (e.target.classList.contains("wt-cart__drawer__close")) {
        e.preventDefault();
        this.toggleDrawerClasses();
      }
    });
  }

  renderContents(parsedState, isClosedCart=true) {
    this.getSectionsToRender().forEach((section) => {
      const sectionElement = section.selector
        ? document.querySelector(section.selector)
        : document.getElementById(section.id);
      sectionElement.innerHTML = this.getSectionInnerHTML(
        parsedState.sections[section.id],
        section.selector,
      );
    });

    if(isClosedCart) {
      setTimeout(() => {
        this.toggleDrawerClasses();
        if (this.isOpen) {
          this.closeButton().focus();
        }
      });
    }
  }

  getSectionInnerHTML(html, selector = ".shopify-section") {
    return new DOMParser()
      .parseFromString(html, "text/html")
      .querySelector(selector).innerHTML;
  }

  getSectionsToRender() {
    return [
      {
        id: "cart-drawer",
        selector: "#CartDrawer",
      },
      {
        id: "cart-icon-bubble",
      },
    ];
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}

customElements.define("cart-drawer", CartDrawerSection);

class CartDrawerItems extends CartItems {
  getSectionsToRender() {
    return [
      {
        id: "CartDrawer",
        section: "cart-drawer",
        selector: ".drawer__inner",
      },
      {
        id: "cart-icon-bubble",
        section: "cart-icon-bubble",
        selector: ".shopify-section",
      },
    ];
  }
}

customElements.define("cart-drawer-items", CartDrawerItems);


// Script added by OCS - To open the cart drawer and refresh the cart items when we click on the wihlist add to cart button.
document.addEventListener("DOMContentLoaded", function () {
  document.body.addEventListener("click", async function (e) {
    const button = e.target.closest(".swym-storefront-layout-grid-item-add-to-cart-button");
    if (!button) return;

    // Wait a bit for the 3rd party wishlist to process the add-to-cart
    // (ideally, listen for an event from the wishlist app if it fires one)
    setTimeout(async () => {
      try {
        const response = await fetch("/cart.js");
        const cartData = await response.json();

        const cartDrawer = document.querySelector("cart-drawer");
        if (cartDrawer && typeof cartDrawer.renderContents === "function") {
          cartDrawer.renderContents(
            { sections: await getCartSections(cartDrawer) },
            true
          );
        }
      } catch (error) {
        console.error("Error updating cart drawer after wishlist add-to-cart:", error);
      }
    }, 500);
  });

  async function getCartSections(cartDrawer) {
    const sectionsToRender = cartDrawer.getSectionsToRender();
    const sectionParams = sectionsToRender
      .map((section) => section.section || section.id)
      .join(",");

    const response = await fetch(`/cart?sections=${sectionParams}`);
    return await response.json();
  }
});


// Added by ocs for gift card product page
document.addEventListener("DOMContentLoaded", () => {
  // Only run this if we're on the correct template
  if (!document.body.classList.contains("template-product-carte-cadeau")) return;

  const cartDrawer = document.querySelector("cart-drawer");
  if (!cartDrawer) return;

  document.body.addEventListener("click", (e) => {
    if (e.target.closest(".wt-cart__trigger, .wt-cart__back-link, .page-overlay-cart, .wt-cart__drawer__close")) {
      e.preventDefault();
      cartDrawer.toggleDrawerClasses();
    }
  });
});

