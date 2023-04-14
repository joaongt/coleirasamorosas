 // OPEN AND CLOSE BAG
 const bagIcon = document.querySelector('#shopping-bag');
 const bag = document.querySelector('.bag');
 const closeBag = document.querySelector('#bag-close');
 const overLays = document.querySelector('#overlays');


 closeBag.addEventListener('click', () => {
     bag.classList.remove('active');
     overLays.style.display = "none";
 })





 const modeSwitch = document.querySelector('#mode-switch');
 const logo = document.querySelector('.logo');
 const changeColor = document.querySelector("#change-class");

 // Retrieve the current mode from local storage, or default to "light"
 const currentMode = localStorage.getItem("mode") || "light";
 if (currentMode === "dark") {
   document.body.classList.add('dark-mode');
   logo.setAttribute('src', '../images/logo-dark-mode.png');
   changeColor.classList.replace('bx-toggle-left', 'bx-toggle-right');
 }

 modeSwitch.addEventListener('click', () => {
   document.body.classList.toggle('dark-mode');
   const newMode = document.body.classList.contains('dark-mode') ? "dark" : "light";

   // Save the new mode in local storage
   localStorage.setItem("mode", newMode);

   if (newMode === "dark") {
     logo.setAttribute('src', '../images/logo-dark-mode.png');
     changeColor.classList.replace('bx-toggle-left', 'bx-toggle-right');
   } else {
     logo.setAttribute('src', '../images/logo-verdin-d.png');
     changeColor.classList.replace('bx-toggle-right', 'bx-toggle-left');
   }
 });


 const errorMsg = document.getElementById("error-msg");
 const errorCloseBtn = document.getElementById("error-close-btn");
 const showError = (message) => {
   errorMsg.innerText = message;
   document.querySelector(".show-error").style.display = "flex";
 };
 errorCloseBtn.addEventListener("click", () => {
   document.querySelector(".show-error").style.display = "none";
 });

//  --------------------------------------------------------------------------

let productId, productImg, productName, price

  const _token = document.cookie;
  const cartProducts = document.querySelector('.prodks')
  cartProducts.addEventListener("click", async (event) => {
    event.preventDefault();
    const addToCartButton = event.target.closest(".add-bag");
    try {

      if(addToCartButton) {
        productId = addToCartButton.dataset.productId,
        productImg = addToCartButton.dataset.productImg,
        productName = addToCartButton.dataset.productName,
        price = addToCartButton.dataset.productPrice
        }

      // Send a POST request to the /add-to-cart endpoint
      const response = await fetch('/add-to-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': _token
        },
        body: JSON.stringify({
          productId: productId,
          productImg: productImg,
          productName: productName,
          price: price
        })
      });

      // Handle the response from the server
      if (response.ok) {
        const data = await response.json();
        showError(data.msg); // Show a success message to the user
      } else {
        const error = await response.json();
        showError(error.msg); // Show an error message to the user
      }
    } catch (error) {

    }
  });

// ---------------------------------------------------------------------------
let total
const openCartButton = document.querySelector('#shopping-bag')
openCartButton.addEventListener("click", async (event) => {
        event.preventDefault();
        try {
          // Send a POST request to the /open-cart endpoint
          const response = await fetch('/open-cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': _token
            }
          });

          // Handle the response from the server
          if (response.ok) {
            
            bagIcon.addEventListener('click', () => {
              bag.classList.add('active');
              overLays.style.display = "block";
            })
            // Replace the contents of the cart table with the rendered bag items
            const cartTable = document.querySelector('#cart-table');
            const responseHTML = await response.text();
            cartTable.innerHTML = responseHTML;

            // Calculate the total price and update the display
            const priceElements = document.querySelectorAll('.price-prod');
            const quantityElements = document.querySelectorAll('.bag-quantity');
            let totalPrice = 0;
            for (let i = 0; i < priceElements.length; i++) {
              const price = parseFloat(priceElements[i].textContent.replace('R$ ', ''));
              const quantity = parseInt(quantityElements[i].value);
              totalPrice += price * quantity;
            }
            const totalElem = document.querySelector('.total-price');
            totalElem.textContent = `R$ ${totalPrice.toFixed(2)}`;
            // Add an event listener to each bag-quantity element
            quantityElements.forEach((elem) => {
              elem.addEventListener('change', () => {
                // Recalculate the total price
                let newTotalPrice = 0;
                priceElements.forEach((priceElem, i) => {
                  const price = parseFloat(priceElem.textContent.replace('R$ ', ''));
                  const quant = parseInt(quantityElements[i].value);
                  total = newTotalPrice += price * quant;
                });
                // Display the new total price in the total-price element
                const totalElem = document.querySelector('.total-price');
                totalElem.textContent = `R$ ${newTotalPrice.toFixed(2)}`;
              });
            });

    } else {
      const error = await response.json();
      showError(error.msg); // Show an error message to the user
    }
  } catch (error) {
    console.error(error);
    showError('An error occurred while loading the cart.');
  }
});



// ---------------------------------------------------------------------------

document.addEventListener("click", async (event) => {
  const { target } = event;
  if (target.classList.contains("bag-remove")) {
    const bagItemId = target.dataset.productId;
    try {
      const response = await fetch(`/remove-from-cart/${bagItemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: _token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        // Update the cart table with the updated cart items
        renderCartTable(data.bagItems);
      } else {
        const error = await response.text();
        showError(error);
      }
    } catch (error) {
      console.error(error);
      showError('An error occurred while deleting product from the cart.');
    }
  }
});

function renderCartTable(bagItems) {
  console.log('renderCartTable: bagItems', bagItems);
  // ...
}






// ---------------------------------------------------------------------------

const checkoutBtn = document.querySelector('.btn-buy');
checkoutBtn.addEventListener('click', () => {
  fetch('/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': _token,
    },
    body: JSON.stringify({
      total: total
    })
  })
  .then(response => response.text())
  .then(script => {
    // Execute the JavaScript code to initiate the PayPal payment flow
    const scriptElem = document.createElement('script');
    scriptElem.textContent = script;
    document.body.appendChild(scriptElem);

    // Redirect to PayPal checkout page
    window.location.href = 'https://www.paypal.com/checkoutnow?token=' + script.match(/(?<=token=)[\w-]+/);
  })
  .catch(error => {
    console.error('Error initiating PayPal payment:', error);
  });
});





// ---------------------------------------------------------------------------

function user(){
    const users = document.querySelector('.users');
    users.style.display = "flex";
}
function userClose(){
    const users = document.querySelector('.users');
    users.style.display = "none";
}
function login(){
    document.getElementById("loading").style.display = "flex";
    setTimeout(()=>{
        window.location.href = '/login'
        document.getElementById("loading").style.display = "none";
    }, 500)
}
function signUp(){
    document.getElementById("loading").style.display = "flex";
    setTimeout(()=>{
        window.location.href = '/signup'
        document.getElementById("loading").style.display = "none";
    }, 500)
}


document.getElementById('log-out').addEventListener('click', async (event) => {
    event.preventDefault();

    // Set the cookie's expiration date to a date in the past
   document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';


    document.getElementById("loading").style.display = "flex";
    setTimeout(()=>{
        window.location.href = '/login';
        document.getElementById("loading").style.display = "none";
    }, 500)
});

