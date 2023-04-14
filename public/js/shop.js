

//   const addBagg = document.querySelectorAll('.add-bag');

// addBagg.forEach(function(button) {
//   button.addEventListener('click', function() {
//     const productId = button.getAttribute('data-product-id');
//     const productName = button.parentNode.querySelector('.product-name').innerText;
//     const price = button.parentNode.querySelector('.product-price').innerText;
  
//     // create a request body with the necessary data
//     const requestBody = {
// 		productId,
//       	productName,
//       	price,
//     };
  
// 	fetch('/add-to-cart', {
// 		method: 'POST',
// 		headers: {
// 		  'Content-Type': 'application/json',
// 		  'Authorization': `Bearer ${token}`
// 		},
// 		body: JSON.stringify(requestBody)
// 	  })
// 	  .then(response => response.text())
// 	  .then(message => console.log(message))
// 	  .catch(error => console.error(error));
	  
	  
//   });
// });

