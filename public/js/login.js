document.getElementById('form').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  });
  
  if (response.ok) {
    // Handle success case
    document.getElementById("loading").style.display = "flex";
    setTimeout(()=>{
        window.location.href = '/';
        document.getElementById("loading").style.display = "none";
    }, 500)
  } else {
    // Handle error case
    const responseData = await response.json();
    const msgContent = responseData.msg.replace(/\n/g, "<br>");
    const msgError = document.getElementById('msgError');
    msgError.setAttribute('style', 'display: block');
    msgError.innerHTML = `<strong>${msgContent}</strong>`;
  }
});



let btn = document.querySelector('#verSenha')
btn.addEventListener('click', ()=>{
  let inputSenha = document.querySelector('#password')
  
  if(inputSenha.getAttribute('type') == 'password'){
    inputSenha.setAttribute('type', 'text')
    btn.classList.remove('fa-eye-slash')
    btn.classList.add('fa-eye')
  } else {
    inputSenha.setAttribute('type', 'password')
    btn.classList.remove('fa-eye')
    btn.classList.add('fa-eye-slash')
  }
})







