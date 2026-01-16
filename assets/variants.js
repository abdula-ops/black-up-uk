if (!customElements.get("variant-options")) {
  customElements.define(
    "variant-options",
    class VariantOptions extends HTMLElement {
      whenLoaded = Promise.all([customElements.whenDefined("gallery-section")]);
      constructor() {
        super();
        this.addEventListener("change", this.onVariantChange);
        this.addEventListener("keydown", this.onKeyDown);

        this.container = document.querySelector(
          `section[data-product-handle="${this.getAttribute("data-product-handle")}"]`,
        );
      }

      connectedCallback() {
        this.whenLoaded.then(() => {
          this.initialize();
        });
      }

      disconnectedCallback() {}

      initialize() {
        this.updateOptions();
        this.updateMasterId();
        this.updateGallery();
        this.updateVariantStatuses();
      }

      onKeyDown(event) {
        if (event.key === "Enter" || event.keyCode === 13) {
          const input = event.target.querySelector("input");
          input?.click();
          // this.onVariantChange();
        }
      }

      onVariantChange() {
        const variantChangeStartEvent = new CustomEvent("variantChangeStart", {
          bubbles: true,
          composed: true,
        });
        this.dispatchEvent(variantChangeStartEvent);
        this.updateOptions();
        this.updateMasterId();
        this.updateGallery();
        this.toggleAddButton(true, "", false);
        this.updatePickupAvailability();
        this.removeErrorMessage();
        this.updateVariantStatuses();
        this.updateQuantityVariant();
        if (document.body.classList.contains('template-product-carte-cadeau')) {
          MagicZoom.refresh();
        }

        // Added by ocs for low stock
        const variantCurrentId = this.currentVariant.id; // This should be a number
        const inputEls = document.querySelectorAll('.low_stock_fields'); // All inputs
        const productContentEl = document.querySelector('.low-stocks-display');
        inputEls.forEach(inputEl => {
          const inputVariantId = parseInt(inputEl.getAttribute('data-variant-id'));
          //console.log("DOM Variant ID:", inputVariantId);
          //console.log("Current Variant ID:", variantCurrentId);
          if (inputVariantId === variantCurrentId) {
            //console.log("Matched Variant ID ✅");
            const variantCount = parseInt(inputEl.getAttribute('data-variant-count'));
            //console.log('Variant Count:', variantCount);
            if (variantCount <= 12) {
              productContentEl.classList.add('show');
            } else {
              productContentEl.classList.remove('show');
            }
          }
        });
        
        

        if (!this.currentVariant) {
          this.toggleAddButton(true, "", true);
          this.setUnavailable();
        } else {
          this.updateMedia();
          this.lenOfVariantOptions =
            document.querySelectorAll("variant-options").length;
          if (this.lenOfVariantOptions === 1) {
            this.updateURL();
          }
          this.updateVariantInput();
          this.renderProductInfo();
          this.updateShareUrl();
        }
        const variantChangeEndEvent = new CustomEvent("variantChangeEnd", {
          bubbles: true,
          composed: true,
        });
        this.dispatchEvent(variantChangeEndEvent);
      }

      // Added by ocs - to pass the details for the notify me form
      updateQuantityVariant() {
        var quantity = this.currentVariant.available;
        var sku = this.currentVariant.sku;                 
        var color = this.currentVariant.option1;             
        var variantId = this.currentVariant.id; 
        var priceVariant = document.querySelector('.wt-product__info .wt-product__price__final');
        var priceText = (priceVariant.textContent || priceVariant.innerText).trim();
        var featureImage = document.querySelector('.wt-product__img');
        var imageSrc = featureImage ? featureImage.getAttribute('src') : null;
        var mailAlertContainer = document.querySelector('.mailalert-container');
        var variantSkuInput = document.querySelector("#variant-sku");
        var variantIdInput = document.querySelector("#variant-id");
        var productColorInput = document.querySelector("#p-color");
        var productImage = document.querySelector("#product-image");
        var priceText = document.querySelector("#product-price");
        
        if (priceText) {
            productImage.value = priceText; 
        }
        if (productImage) {
            productImage.value = imageSrc; 
        }
        if (variantSkuInput) {
            variantSkuInput.value = sku; 
        }
        if (variantIdInput) {
            variantIdInput.value = variantId;  
        }
        if (productColorInput) {
            productColorInput.value = color;   
        }
        if (quantity == false) {
          mailAlertContainer.classList.add('show-alert');
          mailAlertContainer.classList.remove('hide-alert');
        }else{
          mailAlertContainer.classList.remove('show-alert');
          mailAlertContainer.classList.add('hide-alert');
        }          
      }
      //Added by ocs 

      updateGallery() {
        const mediaGallery = document.getElementById(
          `MediaGallery-${this.dataset.section}`,
        );

        let media_id = false;
        if (this.currentVariant && this.currentVariant.featured_media) {
          media_id = this.currentVariant.featured_media.id;
        }

        mediaGallery?.filterSlides(this.options, media_id, true);
        //MagicZoom.refresh();
      }

      updateOptions() {
        const fieldsets = Array.from(
          this.querySelectorAll(".wt-product__option"),
        );
        this.options = fieldsets.map((fieldset) => {
          return Array.from(fieldset.querySelectorAll("input")).find(
            (radio) => radio.checked,
          )?.value;
        });

        fieldsets.forEach((fieldset, index) => {
          const selectedOption = this.options[index];
          fieldset.querySelector(
            ".wt-product__option__title .value",
          ).innerHTML = selectedOption;
          const dropdown = fieldset.querySelector(
            ".wt-product__option__dropdown span",
          );
          if (dropdown) dropdown.innerHTML = selectedOption;
        });
      }

      updateMasterId() {
        this.currentVariant = this.getVariantData()?.find((variant) => {
          return !variant.options
            .map((option, index) => {
              return this.options[index] === option;
            })
            .includes(false);
        });
      }

      updateMedia() {
        if (!this.currentVariant) return;
        this.setAttribute("data-variant-id", this.currentVariant?.id);
        if (!this.currentVariant.featured_media) return;
        this.setAttribute(
          "data-featured-image",
          this.currentVariant?.featured_media?.preview_image?.src,
        );
        this.setAttribute(
          "data-featured-image-id",
          this.currentVariant?.featured_media?.id,
        );

        const modalContent = document.querySelector(
          `#ProductModal-${this.dataset.section} .product-media-modal__content`,
        );
        if (!modalContent) return;
        const newMediaModal = modalContent.querySelector(
          `[data-media-id="${this.currentVariant.featured_media.id}"]`,
        );
        modalContent.prepend(newMediaModal);
      }

      updateURL() {
        if (!this.currentVariant || this.dataset.updateUrl === "false") return;
        window.history.replaceState(
          {},
          "",
          `${this.dataset.url}?variant=${this.currentVariant.id}`,
        );
      }

      updateShareUrl() {
        const shareButton = document.getElementById(
          `Share-${this.dataset.section}`,
        );
        if (!shareButton || !shareButton.updateUrl) return;
        shareButton.updateUrl(
          `${window.shopUrl}${this.dataset.url}?variant=${this.currentVariant.id}`,
        );
      }

      updateVariantInput() {
        const productForms = document.querySelectorAll(
          `#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`,
        );
        productForms.forEach((productForm) => {
          const input = productForm.querySelector('input[name="id"]');
          input.value = this.currentVariant.id;
          input.dispatchEvent(new Event("change", { bubbles: true }));
        });
      }

      updateVariantStatuses() {
        // const selectedOptionOneVariants = this.variantData.filter(
        //   (variant) => this.querySelector(':checked').value === variant.option1
        //   );
        const selectedOptionOneVariants = this.variantData?.filter(
          (variant) => variant.available === true,
        );
        const inputWrappers = [
          ...this.querySelectorAll(".product-form__input"),
        ];
        inputWrappers.forEach((option, index) => {
          if (index === 0 && this.currentVariant?.options.length > 1) return;
          const optionInputs = [
            ...option.querySelectorAll('input[type="radio"], option'),
          ];
          const previousOptionSelected =
            inputWrappers[index - 1]?.querySelector(":checked")?.value;
          const availableOptionInputsValue = selectedOptionOneVariants
            .filter(
              (variant) =>
                variant.available &&
                variant[`option${index}`] === previousOptionSelected,
            )
            .map((variantOption) => variantOption[`option${index + 1}`]);
          this.setInputAvailability(optionInputs, availableOptionInputsValue);
        });
      }

      setInputAvailability(listOfOptions, listOfAvailableOptions) {
        listOfOptions.forEach((input) => {
          if (listOfAvailableOptions.includes(input.getAttribute("value"))) {
            input.classList.remove("disabled");
          } else {
            input.classList.add("disabled");
          }
        });
      }

      updatePickupAvailability() {
        const pickUpAvailability = document.querySelector(
          "pickup-availability",
        );
        if (!pickUpAvailability) return;

        pickUpAvailability.dataset.variantId = this.currentVariant?.id;
        if (this.currentVariant && this.currentVariant.available) {
          pickUpAvailability.fetchAvailability(this.currentVariant.id);
        } else {
          pickUpAvailability.removeAttribute("available");
          pickUpAvailability.innerHTML = "";
        }
      }

      removeErrorMessage() {
        const section = this.closest("section");
        if (!section) return;

        const productForm = section.querySelector("product-form");
        try {
          productForm?.handleErrorMessage();
        } catch (err) {
          console.log(err);
        }
      }

      renderProductInfo() {
        const requestedVariantId = this.currentVariant?.id;
        const sectionId = this.dataset.originalSection
          ? this.dataset.originalSection
          : this.dataset.section;

        fetch(
          `${this.dataset.url}?variant=${requestedVariantId}&section_id=${
            this.dataset.originalSection
              ? this.dataset.originalSection
              : this.dataset.section
          }`,
        )
          .then((response) => {
            // Defensive coding: Check if response is OK
            if (!response.ok) {
              console.error(`variants.js: HTTP error ${response.status} for variant ${requestedVariantId}`);
              throw new Error(`HTTP error ${response.status}`);
            }
            return response.text();
          })
          .then((responseText) => {
            // prevent unnecessary ui changes from abandoned selections
            if (this.currentVariant?.id !== requestedVariantId) return;

            const html = new DOMParser().parseFromString(
              responseText,
              "text/html",
            );
            const destination = document.getElementById(
              `price-${this.dataset.section}`,
            );
            const source = html.getElementById(
              `price-${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`,
            );
            const skuSource = html.getElementById(
              `Sku-${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`,
            );
            const skuDestination = document.getElementById(
              `Sku-${this.dataset.section}`,
            );
            const inventorySource = html.getElementById(
              `Inventory-${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`,
            );
            const inventoryDestination = document.getElementById(
              `Inventory-${this.dataset.section}`,
            );

            if (source && destination) destination.innerHTML = source.innerHTML;
            if (inventorySource && inventoryDestination)
              inventoryDestination.innerHTML = inventorySource.innerHTML;
            if (skuSource && skuDestination) {
              skuDestination.innerHTML = skuSource.innerHTML;
              skuDestination.classList.toggle(
                "visibility-hidden",
                skuSource.classList.contains("visibility-hidden"),
              );
            }

            const price = document.getElementById(
              `price-${this.dataset.section}`,
            );

            if (price) price.classList.remove("visibility-hidden");

            if (inventoryDestination)
              inventoryDestination.classList.toggle(
                "visibility-hidden",
                inventorySource.innerText === "",
              );

            const addButtonUpdated = html.getElementById(
              `ProductSubmitButton-${sectionId}`,
            );
            this.toggleAddButton(
              addButtonUpdated
                ? addButtonUpdated.hasAttribute("disabled")
                : true,
              window.variantStrings.soldOut,
            );
          })
          .catch((error) => {
            // Defensive coding: Handle fetch errors gracefully
            console.error('variants.js: Error fetching product info:', error);
            // Optionally show error message to user or keep current state
          });
      }

      toggleAddButton(disable = true, text, modifyClass = true) {
        const productForm = document.getElementById(
          `product-form-${this.dataset.section}`,
        );
        if (!productForm) return;
        const addButton = productForm.querySelector('[name="add"]');
        const addButtonText = productForm.querySelector('[name="add"] > span');
        if (!addButton) return;

        if (disable) {
          addButton.setAttribute("disabled", "disabled");
          if (text) addButtonText.textContent = text;
        } else {
          addButton.removeAttribute("disabled");
          addButtonText.textContent = window.variantStrings.addToCart;
        }

        if (!modifyClass) return;
      }

      setUnavailable() {
        const button = document.getElementById(
          `product-form-${this.dataset.section}`,
        );
        const addButton = button.querySelector('[name="add"]');
        const addButtonText = button.querySelector('[name="add"] > span');
        const price = document.getElementById(`price-${this.dataset.section}`);
        const inventory = document.getElementById(
          `Inventory-${this.dataset.section}`,
        );
        const sku = document.getElementById(`Sku-${this.dataset.section}`);

        if (!addButton) return;
        addButtonText.textContent = window.variantStrings.unavailable;
        if (price) price.classList.add("visibility-hidden");
        if (inventory) inventory.classList.add("visibility-hidden");
        if (sku) sku.classList.add("visibility-hidden");
      }

      getVariantData() {
        this.variantData =
          this.variantData ||
          JSON.parse(
            this.querySelector('[type="application/json"]').textContent,
          );
        return this.variantData;
      }
    },
  );
}
// customElements.define('variant-options', VariantOptions);
