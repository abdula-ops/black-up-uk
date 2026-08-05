class StickyBuyButton extends HTMLElement {
  constructor() {
    super();

    this.activeClass = "wt-product__sticky-buy--show";
  }

  connectedCallback() {
    this.initialize();
  }

  initialize() {
    const addToCartModule = document.querySelector(".wt-product__add-to-cart");
    const btn = this.querySelector("button");

    const forObserver = document.querySelectorAll(
      ".wt-product__add-to-cart, .wt-footer, .wt-product__name",
    );

    let intersected = [];

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      addToCartModule.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ isIntersecting, target }) => {
        isIntersecting
          ? intersected.push(target)
          : (intersected = intersected.filter((item) => item !== target));
      });

      if (intersected.length) {
        this.classList.remove(this.activeClass);
      } else {
        this.classList.add(this.activeClass);
      }
    });

    forObserver.forEach((item) => {
      observer.observe(item);
    });
  }
}

customElements.define("sticky-buy-button", StickyBuyButton);

if (!customElements.get("gallery-fashion")) {
  customElements.define(
    "gallery-fashion",
    class GalleryFashion extends HTMLElement {
      constructor() {
        super();
        this.section = this.closest("section");
        this.logoBanner = this;
      }

      connectedCallback() {
        this.init();
      }

      disconnectedCallback() {
        this.removeEventsWhenDesignMode();
      }

      addEventsWhenDesignMode() {
        if (Shopify.designMode) {
          document.addEventListener(
            "shopify:section:load",
            this.reinitAfterDelay,
          );
          document.addEventListener(
            "shopify:section:unload",
            this.reinitAfterDelay,
          );
        }
      }

      removeEventsWhenDesignMode() {
        if (Shopify.designMode) {
          document.removeEventListener(
            "shopify:section:load",
            this.reinitAfterDelay,
          );
          document.removeEventListener(
            "shopify:section:unload",
            this.reinitAfterDelay,
          );
        }
      }

      reinitAfterDelay() {
        setTimeout(() => this.reinit(), 0);
      }

      isFirstSection() {
        const sectionWrapper = document.querySelector("#root");
        const firstSection = sectionWrapper.querySelector("section");
        this.section = this.closest("section");
        const currentSection = this.section;

        return firstSection === currentSection;
      }

      handleResize() {
        this.setTopMargin();
        this.positioningProductInfo();
      }

      observeHeader() {
        const header = document.querySelector(".wt-header");
        const activeTransparentClass = "wt-header--fashion-transparent";

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) {
                header.classList.remove(activeTransparentClass);
              } else {
                header.classList.add(activeTransparentClass);
              }
            });
          },
          { root: null, threshold: 0.05 },
        );

        observer.observe(this.querySelector(".wt-product__gallery"));
      }

      calculateOffset() {
        const header = document.querySelector("header");
        const headerHeight = header.offsetHeight;
        const offset =
          this.isTransparentHeaderEnabled() && this.isFirstSection()
            ? headerHeight
            : 0;

        return offset;
      }

      setTopMargin() {
        const offset = this.calculateOffset();
        if (offset) {
          this.section.style.marginTop = `-${offset}px`;
        } else {
          this.section.style.marginTop = 0;
        }
      }

      isTransparentHeaderEnabled() {
        const header = document.querySelector(".wt-header");
        return (
          header.dataset.transparent &&
          header.classList.contains("wt-header--v3")
        );
      }

      renderProgressBar() {
        const thumbsGallery = this.querySelector("[data-thumbs]");
        const progressBarElement = document.createElement("div");
        progressBarElement.classList.add("gallery-fashion__progress-bar");
        const progressBarIndicatorElement = document.createElement("div");
        progressBarIndicatorElement.classList.add(
          "gallery-fashion__progress-bar-indicator",
        );
        progressBarElement.appendChild(progressBarIndicatorElement);
        thumbsGallery.appendChild(progressBarElement);

        function updateProgressBar() {
          const images = this.querySelector("gallery-section");
          const progressBar = progressBarIndicatorElement;

          const scrolled = window.scrollY;
          const maxHeight = images.clientHeight - window.innerHeight;
          const scrollPercentage = (scrolled / maxHeight) * 100;

          const progressBarHeight = progressBarElement.clientHeight;
          const progressHeight = progressBar.clientHeight;
          const maxProgressTop = progressBarHeight - progressHeight;
          const progressTop = Math.min(
            (scrollPercentage / 100) * maxProgressTop,
            maxProgressTop,
          );

          progressBar.style.top = `${progressTop}px`;

          if (progressTop === maxProgressTop) {
            thumbsGallery.classList.add("finished");
          } else {
            thumbsGallery.classList.remove("finished");
          }
        }

        window.addEventListener("scroll", updateProgressBar.bind(this));

        function handleThumbsClick(event) {
          if (event.target.className === "wt-product__img") {
            const thumbnails = Array.from(
              event.currentTarget.querySelectorAll("img"),
            );
            const index = thumbnails.indexOf(event.target);

            const fullImage = this.querySelectorAll(
              ".wt-masonry__wrapper .wt-product__img, .wt-masonry__wrapper .wt-product__thumbnail-video",
            )[index];

            fullImage.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }

        thumbsGallery.addEventListener("click", handleThumbsClick.bind(this));
      }

      positioningProductInfo() {
        const productInfo = this.querySelector(".wt-product__main");
        const mediaDesktop = window.matchMedia("(min-width: 1200px)");

        if (mediaDesktop.matches) {
          productInfo.style.top = `${Math.max((window.innerHeight - productInfo.offsetHeight) / 2, 0)}px`;
        }

        const resizeObserver = new ResizeObserver((entries) => {
          for (let entry of entries) {
            if (mediaDesktop.matches) {
              productInfo.style.top = `${Math.max((window.innerHeight - productInfo.offsetHeight) / 2, 0)}px`;
            }
          }
        });

        const observedElement = productInfo;
        resizeObserver.observe(observedElement);
      }

      attachEvents() {
        window.addEventListener("resize", this.handleResize.bind(this));
      }

      init() {
        this.reinitAfterDelay = this.reinitAfterDelay.bind(this);
        if (this.isTransparentHeaderEnabled()) {
          const stickyHeaderThreshold = document.querySelector(
            ".sticky-header__threshold",
          );
          const isHeaderSticky =
            document.body.classList.contains("page-header-sticky");
          if (isHeaderSticky) {
            stickyHeaderThreshold.style.height = `${this.querySelector(".swiper-wrapper--masonry").offsetHeight}px`;
          }
          this.setTopMargin();
          this.observeHeader();
          this.attachEvents();
        }

        this.renderProgressBar();
        this.positioningProductInfo();
        this.addEventsWhenDesignMode();
      }

      reinit() {
        if (this.isTransparentHeaderEnabled()) {
          const stickyHeaderThreshold = document.querySelector(
            ".sticky-header__threshold",
          );
          const isHeaderSticky =
            document.body.classList.contains("page-header-sticky");
          if (isHeaderSticky) {
            stickyHeaderThreshold.style.height = `${this.querySelector(".swiper-wrapper--masonry").offsetHeight}px`;
          }
          this.setTopMargin();
          this.observeHeader();
        }
        this.positioningProductInfo();
      }
    },
  );
}

function initJudgeMePreviewScroll() {
  const getReviewsTarget = () =>
    document.getElementById("judgeme_product_reviews") ||
    document.getElementById("product-reviews") ||
    document.querySelector(".wt-apps .jdgm-review-widget");

  const scrollToReviews = (event) => {
    const target = getReviewsTarget();
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const bindPreviewBadges = (root = document) => {
    root
      .querySelectorAll(".wt-product__info .jdgm-preview-badge, .wt-product__info .jdgm-prev-badge")
      .forEach((badge) => {
        if (badge.dataset.reviewsScrollBound) return;

        badge.dataset.reviewsScrollBound = "true";
        badge.style.cursor = "pointer";
        badge.setAttribute("role", "link");
        badge.setAttribute("tabindex", "0");
        badge.addEventListener("click", scrollToReviews);
        badge.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            scrollToReviews(event);
          }
        });
      });
  };

  bindPreviewBadges();

  const productInfo = document.querySelector(".wt-product__info");
  if (!productInfo) return;

  const observer = new MutationObserver(() => bindPreviewBadges());
  observer.observe(productInfo, { childList: true, subtree: true });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initJudgeMePreviewScroll);
} else {
  initJudgeMePreviewScroll();
}

const MOBILE_GALLERY_MQ = window.matchMedia("(max-width: 899px)");

function isMobileGalleryViewport() {
  return MOBILE_GALLERY_MQ.matches;
}

function clearMagicZoomArtifacts() {
  document
    .querySelectorAll(".mz-zoom-window, .mz-lens, .mz-hint")
    .forEach((node) => node.remove());
}

function stripMagicZoomLinksOnMobile() {
  if (!isMobileGalleryViewport()) return;

  document.querySelectorAll(".wt-product__gallery a.MagicZoom").forEach((link) => {
    link.classList.remove("MagicZoom");
    link.classList.add("pdp-gallery__link");
    link.removeAttribute("data-options");
  });

  clearMagicZoomArtifacts();
}

function bindGallerySwiperZoomCleanup() {
  const gallerySection = document.querySelector("gallery-section");
  if (!gallerySection?.gallerySwiper || gallerySection.gallerySwiper.__mzCleanupBound) {
    return;
  }

  gallerySection.gallerySwiper.__mzCleanupBound = true;
  gallerySection.gallerySwiper.on("slideChangeTransitionStart", clearMagicZoomArtifacts);
  gallerySection.gallerySwiper.on("touchStart", clearMagicZoomArtifacts);
}

function initMobileGalleryDoubleTapExpand() {
  const gallery = document.querySelector(".wt-product__gallery [data-gallery]");
  if (!gallery || gallery.dataset.mzDoubleTapBound) return;

  gallery.dataset.mzDoubleTapBound = "true";
  let lastTapAt = 0;

  gallery.addEventListener(
    "touchend",
    (event) => {
      if (!isMobileGalleryViewport()) return;

      const imageLink = event.target.closest("a.pdp-gallery__link, a.MagicZoom");
      if (!imageLink?.href) return;

      const now = Date.now();
      if (now - lastTapAt > 350) {
        lastTapAt = now;
        return;
      }

      lastTapAt = 0;
      event.preventDefault();
      window.open(imageLink.href, "_blank", "noopener,noreferrer");
    },
    { passive: false },
  );
}

function initProductGalleryMobileFix() {
  if (!document.body.classList.contains("template-product")) return;
  if (!isMobileGalleryViewport()) return;

  stripMagicZoomLinksOnMobile();

  customElements.whenDefined("gallery-section").then(() => {
    stripMagicZoomLinksOnMobile();
    bindGallerySwiperZoomCleanup();
    initMobileGalleryDoubleTapExpand();
    document.addEventListener("gallery:updated", () => {
      stripMagicZoomLinksOnMobile();
      bindGallerySwiperZoomCleanup();
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initProductGalleryMobileFix);
} else {
  initProductGalleryMobileFix();
}

MOBILE_GALLERY_MQ.addEventListener("change", () => {
  if (!document.body.classList.contains("template-product")) return;
  if (!isMobileGalleryViewport()) return;
  stripMagicZoomLinksOnMobile();
  bindGallerySwiperZoomCleanup();
});
