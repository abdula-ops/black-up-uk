document.addEventListener('DOMContentLoaded', function () {
  var resultArray = [];
  document.querySelector('input[name="mainProductResult"]').value = JSON.stringify(resultArray);
  var steps = document.querySelectorAll('.step');
  
  document.querySelector('.hf-begin').addEventListener('click', function(e) {
    e.preventDefault();
    steps.forEach(function(step) {
      step.classList.add('hidden');
      step.classList.remove('visible');
    });
    document.getElementById('step1').classList.add('visible');
    document.getElementById('step1').classList.remove('hidden');
    document.getElementById('index-container').classList.add('hidden');
  });
  
  document.querySelector('.back-to-step0').addEventListener('click', function(e) {
    e.preventDefault();
    scrollToTop(1500);
    
    if (resultArray.length >= 0) {
      resultArray.pop();  
    }
    steps.forEach(function(step) {
      step.classList.add('hidden');
      step.classList.remove('visible');
    });
    document.getElementById('index-container').classList.add('visible');
    document.getElementById('index-container').classList.remove('hidden');
  });
  
  document.querySelector('.back-to-step1').addEventListener('click', function(e) {
    if (resultArray.length >= 0) {
      resultArray.pop();  
    }
    steps.forEach(function(step) {
      step.classList.add('hidden');
      step.classList.remove('visible');
    });
    document.getElementById('step1').classList.add('visible');
    document.getElementById('step1').classList.remove('hidden');
    document.getElementById('index-container').classList.add('hidden');
  });
  
  document.querySelector('.back-to-step2').addEventListener('click', function(e) {
    e.preventDefault();
    scrollToTop(1500);
    
    if (resultArray.length >= 0) {
      resultArray.pop();  
    }
    steps.forEach(function(step) {
      step.classList.add('hidden');
      step.classList.remove('visible');
    });
    document.getElementById('step2').classList.add('visible');
    document.getElementById('step2').classList.remove('hidden');
    document.getElementById('index-container').classList.add('hidden');
    document.getElementById('routine-process-list').innerHTML = '';
  });
  
  document.querySelector('.back-to-step3').addEventListener('click', function(e) {
    e.preventDefault();
    scrollToTop(1500);
    
    if (resultArray.length >= 0) {
      resultArray.pop();  
    }
    steps.forEach(function(step) {
      step.classList.add('hidden');
      step.classList.remove('visible');
    });
    document.getElementById('step3').classList.add('visible');
    document.getElementById('step3').classList.remove('hidden');
    document.getElementById('index-container').classList.add('hidden');
    document.getElementById('final-product-list').innerHTML = '';
  });
  
  document.querySelector('.back-to-home').addEventListener('click', function(e) {
    e.preventDefault();
    scrollToTop(1500);
      
    for (let i = 0; i < 3; i++) {
      resultArray.pop();
    }
    steps.forEach(function(step) {
      step.classList.add('hidden');
      step.classList.remove('visible');
    });
    document.getElementById('index-container').classList.remove('hidden');
    document.getElementById('final-product-list').innerHTML = '';
    document.getElementById('routine-process-list').innerHTML = '';
  });
  
  document.querySelectorAll('.hf-choice').forEach(function(choiceElement) {  
    choiceElement.addEventListener('click', function(e) {
    const familyKey = this.getAttribute('data-key');
      if (!resultArray.includes(familyKey)) {
        resultArray.push(familyKey);
      }
      document.querySelector('input[name="mainProductResult"]').value = JSON.stringify(resultArray);
      e.preventDefault(); 
      steps.forEach(function(step) {
            step.classList.add('hidden');
            step.classList.remove('visible');
        });
       document.getElementById('step2').classList.add('visible');
       document.getElementById('step2').classList.remove('hidden');
    });
  });
  
  document.querySelectorAll('.hf-choice-txt').forEach(function(choiceElement) {  
    choiceElement.addEventListener('click', function(e) {
      e.preventDefault();
      const classToAdd = e.currentTarget.getAttribute('data-option');
      const classCoverage = e.currentTarget.getAttribute('data-type');
      if (!resultArray.includes(classCoverage)) {
        resultArray.push(classCoverage);
      }
      if (classCoverage === "process" || classCoverage === "routine") {
        document.querySelector('.recommended_products_heading').classList.add('visible');
        document.querySelector('.recommended_products_heading').classList.remove('hidden');
        document.getElementById('routine-process-list').classList.add('visible');
        document.getElementById('routine-process-list').classList.remove('hidden');
      } else {
        document.querySelector('.recommended_products_heading').classList.add('hidden');
        document.querySelector('.recommended_products_heading').classList.remove('visible');
        document.getElementById('routine-process-list').classList.add('hidden');
        document.getElementById('routine-process-list').classList.remove('visible');
      }
      document.querySelector('input[name="mainProductResult"]').value = JSON.stringify(resultArray);
      
      document.querySelectorAll('#step3 .choice-btn-container').forEach(function(element) {
        element.classList.remove('visible');
        element.classList.add('hidden');
      }); 
      document.querySelectorAll('.' + classToAdd).forEach(function(element) {
        element.classList.add('visible');
        element.classList.remove('hidden');
      });  
      steps.forEach(function(step) {
        step.classList.add('hidden');
        step.classList.remove('visible');
      });
     document.getElementById('step3').classList.add('visible');
     document.getElementById('step3').classList.remove('hidden');
    });
  });
  
  document.querySelectorAll('.texture').forEach(function(textureElement) {
    textureElement.addEventListener('click', function(e) {
      e.preventDefault();
       const classTexture = e.currentTarget.getAttribute('data-texture');
        if (!resultArray.includes(classTexture)) {
          resultArray.push(classTexture);
        }
        document.querySelector('input[name="mainProductResult"]').value = JSON.stringify(resultArray);
        steps.forEach(function(step) {
            step.classList.add('hidden');
            step.classList.remove('visible');
        });
       document.getElementById('step4').classList.add('visible');
       document.getElementById('step4').classList.remove('hidden');
    });
  });

    
  // Script to make the back to previous window sudden jumpt to scroll smooth
  function scrollToTop(duration = 1000) {
    const start = window.scrollY;
    const startTime = performance.now();
  
    function scrollStep(timestamp) {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      window.scrollTo(0, start * (1 - ease));
  
      if (progress < 1) {
        requestAnimationFrame(scrollStep);
      }
    }
    requestAnimationFrame(scrollStep);
  }

  
  // Script to trigger the function for display the product details
  document.querySelectorAll(".texture").forEach(span => {
    span.addEventListener("click", function () {
      renderMultipleProductCards('#final-product-list');
    });
  });


  // Script to trigger the function for display the product details from the 2nd step itself
  document.querySelectorAll(".hf-choice-txt").forEach(span => {
    span.addEventListener("click", function () {
      const option = span.getAttribute("data-option");
      if (option === "option4" || option === "option5") {
        renderMultipleProductCards('#routine-process-list');
      }
    });
  });

  // Function to display main product details
  function renderMultipleProductCards(targetSelector) {
    const field = document.getElementById("mainProductGroup");
    let selectedProductIds = "";
  
    const rawValue = field.value.trim();
    const isNumericIDList = /^[\d,\s]+$/.test(rawValue);
  
    if (isNumericIDList) {
      selectedProductIds = rawValue
        .split(',')
        .map(id => id.trim())
        .filter(Boolean)
        .map(id => `${id}`)
        .join(' OR ');
      // console.log("Selected Product IDs from plain input:", selectedProductIds);
    } else {
      let currentArray = rawValue ? JSON.parse(rawValue) : [];
      const match = window.productCombinations.find(item =>
        JSON.stringify(item.combo) === JSON.stringify(currentArray)
      );
  
      if (match && match.productIds && match.productIds.length > 0) {
        selectedProductIds = match.productIds
          .map(id => id.split("/").pop())
          .map(id => `${id}`)
          .join(' OR ');
        // console.log("Selected Product IDs from combination:", selectedProductIds);
      } else {
        console.log("No matching main products found.");
        return;
      }
    }
  
    if (!selectedProductIds) {
      console.log("No valid main product IDs found.");
      return;
    }
    
    return new Promise((resolve, reject) => {
      $.ajax({
        url: 'https://blackup-prod.myshopify.com/api/2025-01/graphql.json',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        headers: {
            'X-Shopify-Storefront-Access-Token': '7bc36bd9f13fd0fd347aff9f165713ff'
        },
        data: JSON.stringify({
          query: `
            {
              products(first: 10, query: "id:${selectedProductIds}") {
                nodes {
                  handle
                  id
                  title
                  media(first: 2) {
                    nodes {
                      previewImage {
                        altText
                        url
                      }
                    }
                  }
                  priceRange {
                    maxVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                  selectedOrFirstAvailableVariant {
                    id
                    price {
                      amount
                    }
                    compareAtPrice {
                      amount
                    }
                  }
                }
              }
            } `
         }),
        cache: false,
        success: function(response) {
          var langHtml = document.querySelector("html"); 
          if(langHtml.getAttribute("lang") == "fr") {
            store_language = "";
            addtocart_text = "add to cart";
          }else if(langHtml.getAttribute("lang") == "en"){
            store_language = "";
            addtocart_text = "Add to Cart";
          }
          var productlist = '<div class="custom_group_product_list">';
            response.data.products.nodes.forEach(function(product) {
              productlist += '<div class="collection__grid__item scroll-trigger animate--slide-in disabled-on-mobile" style="--animation-order: 1;"><div class="card__container"><div class="card__picture-container">';
              productlist += '<a href="/' + store_language + 'products/' + product.handle + '" class="card card--left" tabindex="0" aria-label="Open product page">';
              productlist += '<picture class="card__picture" data-uri="' + product.handle + '"><div class="card__loader hidden"></div>';
              product.media.nodes.forEach(function(image, keys) {
                if(keys ==0){
                  productlist += '<img class="card__img card__img_normal" srcset="'+image.previewImage.url+' 375w, '+image.previewImage.url+' 750w, '+image.previewImage.url+' 1000w, '+image.previewImage.url+' 1000w" sizes="(min-width: 1000px) 620px, 100vw" src="'+image.previewImage.url+'" data-src="'+image.previewImage.url+'" alt="'+image.previewImage.altText+'" loading="eager" width="1430" height="1862">';
                }else{
                  productlist += '<img class="card__img card__img--hover" srcset="'+image.previewImage.url+' 750w, '+image.previewImage.url+' 1000w, '+image.previewImage.url+' 1000w" sizes="(min-width: 1000px) 620px, 100vw" src="'+image.previewImage.url+'" alt="'+image.previewImage.altText+'" loading="eager" width="1430" height="1862">';
                }
              });
              let originalPrice = parseFloat(product.selectedOrFirstAvailableVariant.price.amount).toFixed(2).replace('.', ',');
              let comparePriceCheck = product.selectedOrFirstAvailableVariant.compareAtPrice;
              productlist += '</picture></a></div>';
              productlist += '<div class="card_content"><a href="/' + store_language + 'products/' + product.handle + '" tabindex="-1" class="card card--left">';
              productlist += '<div class="card_title_price_container"><h3 class="card__title">'+ product.title +'</h3>';
              productlist += '<div class="card__price"><div class="price  price--on-sale"><div class="price__container">';
              productlist += '<div class="price__regular"><span class="price-item price-item--regular wt-product__price__final wt-product__price__final">€'+ originalPrice +'</span></div>';
              productlist += '<div class="price__sale visible "><div class="price__sale__details-wrapper">';
              productlist += '<span class="price-item price-item--sale price-item--last wt-product__price__final">€'+ originalPrice +'</span>';
              if (comparePriceCheck != null){
                let comparePriceFinal = parseFloat(product.selectedOrFirstAvailableVariant.compareAtPrice.amount).toFixed(2).replace('.', ',');
                let originalPriceWithoutFixed = parseFloat(product.selectedOrFirstAvailableVariant.price.amount);
                let comparePrice = parseFloat(product.selectedOrFirstAvailableVariant.compareAtPrice.amount);
                let discountPercentage = ((comparePrice - originalPriceWithoutFixed) / comparePrice) * 100;
                discountPercentage = Math.round(discountPercentage);
                if((comparePrice > 0) && (comparePriceFinal != originalPrice)){
                  productlist += '<span class="price-item--percent">-'+ discountPercentage +'%</span></div>';
                  productlist += '<span><s class="price-item price-item--regular price-item--lower wt-product__price__compare ">€'+ comparePriceFinal +'</s></span>';
                }else{
                  productlist += '<span class="empty-price-item--percent"></span></div>';
                  productlist += '<span><s class="price-item price-item--regular price-item--lower wt-product__price__compare "></s></span>';
                }
              }else{
                productlist += '<span class="empty-price-item--percent"></span></div>';
                productlist += '<span><s class="price-item price-item--regular price-item--lower wt-product__price__compare "></s></span>';
              }
              productlist += '</div></div></div></div></div></a></div>';
              productlist += '<div class="card__quick-add-container"><quick-add data-product-handle="' + product.handle + '"><button aria-label="add to cart" class="button--full-width hero__button--secondary" type="button" name="commit" data-product-url="/' + store_language + 'products/' + product.handle + '" tabindex="0"><span>'+ addtocart_text +'</span></button></quick-add></div>';
              productlist += '</div></div>';
            });
          productlist += '</div>';
          document.querySelector(targetSelector).innerHTML = productlist;
        },
        error: function(xhr, status, error) {
            console.error('AJAX Error:', error);
        }
      });
    });
  }

  // Script to show the selected variant color image when we hover over the color swatch
  document.querySelectorAll('.card__container').forEach(function(productCard) {
    productCard.querySelectorAll('.color_swatch li').forEach(function(item) {
      item.addEventListener('mouseover', function() {
        var imageUrl = item.querySelector('span').getAttribute('data-image-url');
        console.log(imageUrl);
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
  
});