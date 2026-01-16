document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('.notify_failure').style.display = 'none';
  document.querySelector('.notify_success').style.display = 'none';

  function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  document.querySelector('#MailNotify').addEventListener('click', function(event) {
    // Prevent default form submission
    event.preventDefault();
    
    // Select the hidden input and the span element
    var hiddenInput = document.getElementById("value");
    // Get the email value
    var email = document.querySelector('#emails').value;

    // Get the product name value
    var productName = document.querySelector('#p-name').value;
    var productUrl = document.querySelector('#p-url').value;
    var productId = document.querySelector('#p-id').value;
    var productPrice = document.querySelector("#product-price").value;
    var productImage = document.querySelector("#product-image").value;
    var productColor = document.querySelector("#p-color").value;
    var variantSku = document.querySelector("#variant-sku").value;
    var variantId = document.querySelector("#variant-id").value;
    var storeLanguage = document.querySelector("#store-language").value;
    var customerId = document.querySelector("#customerid").value;
    var customerName = document.querySelector("#customername").value;

    console.log('Email to be posted:', email);
    console.log('Product Name:', productName);
    console.log('Product Url:', productUrl);
    console.log('Product Id:', productId);
    console.log('Product Price:', productPrice);
    console.log('Product Image:', productImage);
    console.log('Product Color:', productColor);
    console.log('Variant Sku:', variantSku);
    console.log('Variant Id:', variantId);
    console.log('Store Language:', storeLanguage);
    console.log('Customer Id:', customerId);
    console.log('Customer Name:', customerName);

    // Validate the email if necessary
    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return false;
    }

    // Prepare the data to send via AJAX
    var data = {
      email: email,
      productName: productName,
      productUrl: productUrl,
      productId: productId,
      productPrice: productPrice,
      productImage: productImage,
      productColor: productColor,
      variantSku: variantSku,
      variantId: variantId,
      storeLanguage: storeLanguage,
      customerId: customerId,
      customerName: customerName
    };

    // Create an XMLHttpRequest to send the data
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://ps16.store-and-supply.com/shopify_apps/blackup/back_to_stock/import_script/email_alert.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // Encode the data to send it as URL-encoded string
    var params = '';
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        params += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&';
      }
    }
    params = params.slice(0, -1); // Remove the trailing '&'

    // Set up the callback to handle the response
    xhr.onload = function() {
      if (xhr.status === 200) {
        var response = xhr.responseText;
        if (response === "Customer data registered") {
          document.querySelector('.notify_success').style.display = 'block';
          document.querySelector('.notify_failure').style.display = 'none';
        } else if (response === "Already registered this mail") {
          document.querySelector('.notify_failure').style.display = 'block';
          document.querySelector('.notify_success').style.display = 'none';
        } else {
          console.error('Unexpected response:', response);
        }
      } else {
        console.error('Error posting email:', xhr.statusText);
        document.querySelector('.notify_failure').style.display = 'block';
        document.querySelector('.notify_success').style.display = 'none';
      }
    };

    // Send the request with the encoded data
    xhr.send(params);
  });
});

