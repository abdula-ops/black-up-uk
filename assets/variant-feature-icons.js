document.addEventListener('click', function (e) {
  const variantOption = e.target.closest('variant-options');

  if (variantOption) {
  

    setTimeout(() => {
      //const newImage = variantOption.getAttribute('data-featured-image');
      
      // Defensive coding: check if elements exist before accessing properties
      const selectedColorReplace = document.querySelector('.wt-product__option__body--drawer .drawer__list__item input:checked + label span');
      
      if (!selectedColorReplace) {
        console.warn('variant-feature-icons: selectedColorReplace element not found');
        return;
      }
      
      const selectedColorReplaceAttr = selectedColorReplace.getAttribute('data-color');
      const selectedColor = document.querySelector('.selected-color');
      const selectedColorNameEl = document.querySelector('.wt-product__option__title .value');
      const colorFeatured = document.querySelector('.color-feature');
      
      if (selectedColorNameEl) {
        const selectedColorName = selectedColorNameEl.textContent.trim();
        console.log(selectedColorName);
      }
      
      if (selectedColor && selectedColorReplaceAttr) {
        selectedColor.style.background = selectedColorReplaceAttr;
        if (colorFeatured) {
          colorFeatured.style.background = selectedColorReplaceAttr;
        }
      }
      // if (newImage) {
      //   const colorImage = document.querySelector('.color-feature img');
      //   if (colorImage) {
      //     colorImage.setAttribute('src', newImage);
      //     colorImage.setAttribute('srcset', newImage);
      //   }
      // }
    }, 300); // Delay in milliseconds
  }
});


function syncSelectedColorToInput() {
  const selectedColorNameEl = document.querySelector('.wt-product__option__title .value');
  const selectedColorName = selectedColorNameEl ? selectedColorNameEl.textContent.trim() : '';
  if (selectedColorName) {
    const inputs = document.querySelectorAll('.f-button__list__item input');

    inputs.forEach(input => {
      if (input.value.trim().toLowerCase() === selectedColorName.toLowerCase()) {
        input.classList.add('active_picker');
      } else {
        input.classList.remove('active_picker');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  syncSelectedColorToInput();
  document.addEventListener('click', function () {
    setTimeout(() => {
    syncSelectedColorToInput();
    }, 300);
  });

  // Defensive coding: check if elements exist before accessing properties
  const selectedColorReplace = document.querySelector('.wt-product__option__body--drawer .drawer__list__item input:checked + label span');
  
  if (selectedColorReplace) {
    const selectedColorReplaceAttr = selectedColorReplace.getAttribute('data-color');
    const selectedColor = document.querySelector('.selected-color');
    const selectedColorNameEl = document.querySelector('.wt-product__option__title .value');
    
    if (selectedColorNameEl) {
      const selectedColorName = selectedColorNameEl.textContent.trim();
      setTimeout(() => {
        console.log(selectedColorName);
        if (selectedColor && selectedColorReplaceAttr) {
          selectedColor.style.background = selectedColorReplaceAttr;
        }
      }, 300);
    }
  }
});
