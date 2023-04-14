let btn = document.querySelector('#verSenha')
let btnConfirm = document.querySelector('#verConfirmSenha')


let nome = document.querySelector('#name')
let labelNome = document.querySelector('#labelNome')
let validNome = false

let email = document.querySelector('#email')
let labelEmail = document.querySelector('#labelEmail')
let validEmail = false

let cpf = document.querySelector('#cpf')
let labelCpf = document.querySelector('#labelCpf')
let validCpf = false

let tel = document.querySelector('#tel')
let labelTel = document.querySelector('#labelTel')
let validTel = false

let senha = document.querySelector('#password')
let labelSenha = document.querySelector('#labelSenha')
let validSenha = false

let confirmSenha = document.querySelector('#confirmPassword')
let labelConfirmSenha = document.querySelector('#labelConfirmSenha')
let validConfirmSenha = false

let msgError = document.querySelector('#msgError')
let msgSuccess = document.querySelector('#msgSuccess')

let form = document.querySelector('#form')
let emailV = document.querySelector('#email').value

nome.addEventListener('keyup', () => {
  if(nome.value.length <= 2){
    labelNome.setAttribute('style', 'color: red')
    labelNome.innerHTML = 'Nome *Insira no minimo 3 caracteres'
    nome.setAttribute('style', 'border-color: red')
    validNome = false
  } 
  else if(nameValidation(nome.value) !== true){
    labelNome.setAttribute('style', 'color: red')
    labelNome.innerHTML = 'Nome *Escreva um nome existente'
    nome.setAttribute('style', 'border-color: red')
    validNome = false
  }
  
  else {
    labelNome.setAttribute('style', 'color: green')
    labelNome.innerHTML = 'Nome'
    nome.setAttribute('style', 'border-color: green')
    validNome = true
  }
})

email.addEventListener('keyup', () => {
  if(email.value.length <= 8){
    labelEmail.setAttribute('style', 'color: red')
    labelEmail.innerHTML = 'Email *Insira no minimo 8 caracteres'
    email.setAttribute('style', 'border-color: red')
    validEmail = false
  } 
  else if(emailValidation(email.value) !== true){
    labelEmail.setAttribute('style', 'color: red')
    labelEmail.innerHTML = 'Email *O formato do email deve ser Ex: name@abc.com'
    email.setAttribute('style', 'border-color: red')
    validEmail = false
  }
  else {
    labelEmail.setAttribute('style', 'color: green')
    labelEmail.innerHTML = 'Email'
    email.setAttribute('style', 'border-color: green')
    validEmail = true
  }
})
cpf.addEventListener('keyup', () => {
  if(cpf.value.length <= 13){
    labelCpf.setAttribute('style', 'color: red')
    labelCpf.innerHTML = 'CPF *Insira 11 caracteres'
    cpf.setAttribute('style', 'border-color: red')
    validCpf = false
  } else if(cpfValidation(cpf.value) !== true){
    labelCpf.setAttribute('style', 'color: red')
    labelCpf.innerHTML = 'CPF *O formato do cpf deve ser correto'
    cpf.setAttribute('style', 'border-color: red')
    validCpf = false
  } 
  else {
    labelCpf.setAttribute('style', 'color: green')
    labelCpf.innerHTML = 'CPF'
    cpf.setAttribute('style', 'border-color: green')
    validCpf = true
  }
})

tel.addEventListener('keyup', () => {
  if(tel.value.length <= 14){
    labelTel.setAttribute('style', 'color: red')
    labelTel.innerHTML = 'Telefone *Insira um número de telefone valido'
    tel.setAttribute('style', 'border-color: red')
    validTel = false
  } 
  else if(telValidation(tel.value) !== true){
    labelTel.setAttribute('style', 'color: red')
    labelTel.innerHTML = 'Telefone *O formato do número de telefone deve ser correto'
    tel.setAttribute('style', 'border-color: red')
    validTel = false
  }else {
    labelTel.setAttribute('style', 'color: green')
    labelTel.innerHTML = 'Telefone'
    tel.setAttribute('style', 'border-color: green')
    validTel = true
  }
})


senha.addEventListener('keyup', () => {
  if(senha.value.length <= 5){
    labelSenha.setAttribute('style', 'color: red')
    labelSenha.innerHTML = 'Senha *Insira no minimo 6 caracteres'
    senha.setAttribute('style', 'border-color: red')
    validSenha = false
  } 
  else if(validatorPassword(senha.value) !== true){
    labelSenha.setAttribute('style', 'color: red')
    labelSenha.innerHTML = 'Senha *Insira caractere especial (Ex: @!&$)'
    senha.setAttribute('style', 'border-color: red')
    validSenha = false
  }
  else {
    labelSenha.setAttribute('style', 'color: green')
    labelSenha.innerHTML = 'Senha'
    senha.setAttribute('style', 'border-color: green')
    validSenha = true
  }
})

confirmSenha.addEventListener('keyup', () => {
  if(senha.value != confirmSenha.value){
    labelConfirmSenha.setAttribute('style', 'color: red')
    labelConfirmSenha.innerHTML = 'Confirmar Senha *As senhas não conferem'
    confirmSenha.setAttribute('style', 'border-color: red')
    validConfirmSenha = false
  } else {
    labelConfirmSenha.setAttribute('style', 'color: green')
    labelConfirmSenha.innerHTML = 'Confirmar Senha'
    confirmSenha.setAttribute('style', 'border-color: green')
    validConfirmSenha = true
  }
})

function validatorPassword(senha) {
  let passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  return passwordPattern.test(senha);
}
function emailValidation(email){
  let emailPattern = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  return emailPattern.test(email);
}
function nameValidation(name){
  let namePattern = /^([a-zA-Zà-úÀ-Ú]+[ ]{0,1}){1,}$/u
  return namePattern.test(name);
}
function cpfValidation(cpf){
  let cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/u
  return cpfPattern.test(cpf);
}

function telValidation(tel){
  let telPattern = /^\(?\d{2}\)?[- ]?\d{4,5}[- ]?\d{4}$/u
  return telPattern.test(tel);
}


document.getElementById('form').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const cpf = document.getElementById('cpf').value;
  const tel = document.getElementById('tel').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  const response = await fetch('/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      email,
      cpf,
      tel,
      password,
      confirmPassword
    })
  });
  
  if (response.ok) {
    // Handle success case
    document.getElementById("loading").style.display = "flex";
    setTimeout(()=>{
        window.location.href = '/login';
        document.getElementById("loading").style.display = "none";
    }, 500)
  } else {
    // Handle error case
    const responseData = await response.json();
    console.log(responseData)
    const msgContent = responseData.msg.replace(/\n/g, "<br>");
    const msgError = document.getElementById('msgError');
    msgError.setAttribute('style', 'display: block');
    msgError.innerHTML = `<strong>${msgContent}</strong>`;
  }
});


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


btnConfirm.addEventListener('click', ()=>{
  let inputConfirmSenha = document.querySelector('#confirmPassword')
  
  if(inputConfirmSenha.getAttribute('type') == 'password'){
    inputConfirmSenha.setAttribute('type', 'text')
    btnConfirm.classList.remove('fa-eye-slash')
    btnConfirm.classList.add('fa-eye')
  } 
  else {
    inputConfirmSenha.setAttribute('type', 'password')
    btnConfirm.classList.remove('fa-eye')
    btnConfirm.classList.add('fa-eye-slash')
  }
})

const cpfV = document.querySelector('#cpf')

cpfV.addEventListener('keypress', () => {

  let cpfVlength = cpfV.value.length

  if(cpfVlength === 3 || cpfVlength === 7){
    cpfV.value += '.'
  }else if(cpfVlength === 11){
    cpfV.value += '-'
  }
})

const telV = document.querySelector('#tel')

telV.addEventListener('keypress', () => {

  let telVlength = telV.value.length

  if(telVlength === 0){
    telV.value += '('
  }else if(telVlength === 3){
    telV.value += ') '
  }
  else if(telVlength === 10){
    telV.value += '-'
  }
})