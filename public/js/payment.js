

// Retrieve saved data from local storage
let savedItems = localStorage.getItem("itemsAdded");

if (savedItems) {
  // Parse the retrieved data to an array of objects
  let itemsAdded = JSON.parse(savedItems);

  // Render the saved items on the new page
  renderSavedItems(itemsAdded);
}

// Function to render the saved items
function renderSavedItems(items) {
  // Get the element where you want to render the saved items
  const savedItemsContainer = document.querySelector("#saved-items-container");

  // Iterate through the array of items and create the HTML format for each item
  items.forEach((item) => {
    let itemElement = `
      <div class="bag-box" id="bag-box-id">
        <img src="${item.imgSrc}" class="bag-img" id="bag-img-id" alt="${item.name}">
        <div class="detail-box" id="detail-box-id">
         <div class="bag-product-title" id="bag-product-title-id">${item.name}</div>
         <div class="detail-box">
         <div class="bag-price" id="bag-price-id">R$ ${item.price}</div>
         </div>
         <div class="detail-box">
         <input type="number" value="1" class="bag-quantity" id="bag-quantity-id">
         </div>
         </div>

 
        <!-- REMOVE BAG -->
        <i class='bx bx-trash-alt bag-remove' id="bag-remove-id"></i>
        </div>
      </div>
    `;
    // Append the item HTML element to the container element
    savedItemsContainer.innerHTML += itemElement;
  });
}

// function cloneElement() {
//   // get the original element
//   const originalElement = document.querySelector('.bag-content');

//   // clone the original element
//   const clonedElement = originalElement.cloneNode(true);

//   // append the cloned element to the target element
//   const targetElement = document.getElementById('saved-items-container');
//   targetElement.appendChild(clonedElement);
// }


function keepBuying(){
	window.location.href = '/shop'
  }
  function updateTotal() {
    let bagBoxes = document.querySelectorAll('.bag-box');
    const totalElement = bag.querySelector('.total-price');
    let total = 0;
    bagBoxes.forEach((bagBox) => {
        let priceElement = bagBox.querySelector('.bag-price');
        let price = parseFloat(priceElement.innerHTML.replace("R$", ""));
        let quantity = bagBox.querySelector('.bag-quantity').value;
        total += price * quantity;
    });

     
     // keep 2 digits after the decimal point
     total = total.toFixed(2);
     // or you can use also
     // total = Math.round(total * 100) / 100;
 
     totalElement.innerHTML = "R$ " + total;
 }
 

const button = document.querySelector("#checkout-button")
button.addEventListener("click", () => {
  fetch("http://localhost:5500/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        { id: 1, quantity: 3 },
        { id: 2, quantity: 1 },
      ],
    }),
  })
    .then(res => {
      if (res.ok) return res.json()
      return res.json().then(json => Promise.reject(json))
    })
    .then(({ url }) => {
      window.location = url
    })
    .catch(e => {
      console.error(e.error)
    })
})