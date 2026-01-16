class StickyFilters extends HTMLElement {
  constructor() {
    super();
    
  }
  
  connectedCallback() { 
  document.querySelectorAll('.card__container').forEach(function(productCard) {
      productCard.querySelectorAll('.color_swatch li').forEach(function(item) {
        item.addEventListener('mouseover', function() {
          var imageUrl = item.querySelector('span').getAttribute('data-image-url');
          var mainProductImage = productCard.querySelector('.card__img:not(.card__img--hover)');
          mainProductImage.setAttribute('src', imageUrl);
          mainProductImage.setAttribute('srcset', imageUrl);
        });
        
        item.addEventListener('mouseout', function() {
          var mainProductImage = productCard.querySelector('.card__img:not(.card__img--hover)');
          var getMainImage = mainProductImage.getAttribute('data-src');
          mainProductImage.setAttribute('src', getMainImage);
          mainProductImage.setAttribute('srcset', getMainImage);
        });
    
      });
    }); 
  }
}

// Define the web component
customElements.define("sticky-filters", StickyFilters);
