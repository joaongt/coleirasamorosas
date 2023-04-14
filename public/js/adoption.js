const inDog = document.getElementById('input-dog')
const inCat = document.getElementById('input-cat')
const petBreedInput = document.getElementsByName('petBreed')[0];


const wrapper = document.querySelector(".wrapper"),
  selectBtn = wrapper.querySelector(".select-btn"),
  searchInp = wrapper.querySelector("input"),
  options = wrapper.querySelector(".options");

let dogRaces = ["Sem raça","Labrador Retriever","Golden Retriever","Poodle","Bulldog Francês","Shih Tzu","Yorkshire Terrier","Pastor Alemão","Rottweiler","Maltês","Lhasa Apso","Boxer","Border Collie","Chihuahua","Bichon Frisé","Bernese Mountain Dog","Bull Terrier","Cocker Spaniel","Dachshund","Doberman","Husky Siberiano","Jack Russell Terrier","Pinscher","Schnauzer","Setter Irlandês","Shar Pei","Spitz Alemão","Staffordshire Bull Terrier","American Bully","American Pit Bull Terrier","Basset Hound","Beagle","Bichon Havanes","Boston Terrier","Bouvier des Flandres","Bulldog Inglês","Bulldog Americano","Bulldog Campeiro","Bulldog Australiano","Bullmastiff","Cane Corso","Chow Chow","Dálmata","Dogue Alemão","Dogue de Bordeaux","Fila Brasileiro","Foxhound Americano","Fox Terrier","Galgo Espanhol","Greyhound","Griffon de Bruxelas","Havanese","Irish Wolfhound","Komondor","Kuvasz","Lagotto Romagnolo","Leão da Rodésia","Lulu da Pomerânia","Mastiff","Mastim Napolitano","Old English Sheepdog","Papillon","Pequinês","Pinscher Miniatura","Pit Bull","Pointer","Pug","Rhodesian Ridgeback","Rough Collie","Saluki","Samoieda","São Bernardo","Scottish Terrier","Setter Gordon","Shetland Sheepdog","Shiba Inu","Silky Terrier","Skye Terrier","Smooth Collie","Springer Spaniel Inglês","Tosa Inu","Weimaraner","Welsh Corgi Cardigan","Welsh Corgi Pembroke","West Highland White Terrier","Whippet","Xoloitzcuintle","Yorkshire Terrier",];

let catRaces = ["Sem raça", "Siamês", "Nebelung", "Persa", "Sphynx", "Bengal", "Ragdoll", "British Shorthair", "Himalaio", "Maine Coon", "Scottish Fold", "Abissínio", "Burmese", "Devon Rex", "Munchkin", "Russian Blue", "Siberiano", "Tonquinês", "American Shorthair", "Azul Russo", "Chartreux", "Cornish Rex", "Manx", "Norueguês da Floresta", "Ocicat", "Pelo Curto Brasileiro", "Peterbald", "Savannah", "Snowshoe", "Toyger", "Serval", "Angorá", "Van Turco", "Balinês", "Bombay", "Burmilla", "California Spangled", "Chantilly-Tiffany", "Cymric", "Gato-de-bengala", "Havana Brown", "Javanês", "Korat", "LaPerm", "Lykoi", "Mau Egípcio", "Mekong Bobtail", "Norwegian Forest Cat", "Pixie Bob", "Rex Devon", "Rex Selkirk", "Singapura", "Sokoke", "Somali", "Sphynx Dwelf", "Sphynx Elf", "Sphynx Bambino", "Thai", "Tonkinese", "Toybob", "Turkish Angora", "Turkish Van", "York Chocolate"];

inDog.addEventListener("change", () => {
  if (inDog.checked) {
    addCountry(dogRaces);
  }
});

inCat.addEventListener("change", () => {
  if (inCat.checked) {
    addCountry(catRaces);
  }
});



function addCountry(selectedCountry) {
  options.innerHTML = "";
  const races = inDog.checked ? dogRaces : catRaces;
  races.forEach(country => {
    let isSelected = country == selectedCountry ? "selected" : "";
    let li = `<li onclick="updateName(this, '${country}')" class="${isSelected}">${country}</li>`;
    options.insertAdjacentHTML("beforeend", li);
  });
}

addCountry();

function updateName(selectedLi) {
  const selectedValue = selectedLi.innerText;
  searchInp.value = "";
  addCountry(selectedValue);
  wrapper.classList.remove("active");
  selectBtn.firstElementChild.innerText = selectedValue;
  petBreedInput.value = selectedValue;
}



searchInp.addEventListener("keyup", () => {
  let arr = [];
  let searchWord = searchInp.value.toLowerCase();
  const races = inDog.checked ? dogRaces : catRaces;
  arr = races.filter(data => {
    return data.toLowerCase().startsWith(searchWord);
  }).map(data => {
    let isSelected = data == selectBtn.firstElementChild.innerText ? "selected" : "";
    return `<li onclick="updateName(this)" class="${isSelected}">${data}</li>`;
  }).join("");
  options.innerHTML = arr ? arr : `<p style="margin-top: 10px;">Ops! Raça não encontrada</p>`;
});

selectBtn.addEventListener("click", () => wrapper.classList.toggle("active"));

const overLay = document.querySelector('#overlay')

function openSignPet() {
  if (!isAuthenticated()) {
    showError("Por favor, faça seu login para cadastrar seu animalzinho");
    return;
  }
  const adoptBtn = document.querySelector('.want-to-adopt');
  overLay.style.display = "block";
  adoptBtn.style.display = "flex";
}

function closeSignPet() {
  const wantTo = document.querySelector('.want-to-adopt');
  overLay.style.display = "none";
  wantTo.style.display = "none";
}

const fileInput = document.getElementById('input-pet-img');
const fileDropzone = document.getElementById('file-dropzone');
const fileName = document.querySelector('.file-name');

fileInput.addEventListener('change', function () {
  const file = this.files[0];
  const allowedMimes = [
    "image/jpeg",
    "image/pjpeg",
    "image/jpg",
    "image/png"
  ];

  if (allowedMimes.includes(file.type)) {
    fileDropzone.classList.add('dragging');
    fileName.innerHTML = file.name;
    fileName.style.color = 'green';
    document.querySelector('.dragging').style.borderColor = 'green'
  } else {
    fileDropzone.classList.add('dragging');
    fileName.innerHTML = 'Tipo de arquivo não aceito.';
    fileName.style.color = 'red';
    document.querySelector('.dragging').style.borderColor = 'red'
  }
});
fileDropzone.addEventListener('dragend', function (e) {
  e.preventDefault();
  fileDropzone.classList.remove('dragging');
});



const petFlex = document.querySelector(".pet-flex");

// Declare variables outside of the event listener
let petId, petBreed, petAge, petName, petImagePath;

petFlex.addEventListener("click", (event) => {
  const pet = event.target.closest(".adopt");
  if (pet) {
    petId = pet.dataset.id;
    petBreed = pet.dataset.breed;
    petAge = pet.dataset.age;
    petName = pet.dataset.name;
    petImg = pet.dataset.img;
    petPhoneNumber = pet.dataset.phone_number;
    petsInfo = pet.dataset.pet_info;

    // Show more details about the pet, such as a modal or a new page
    console.log(`Clicked on pet with ID ${petId} and breed ${petBreed}`);

    const adoptButton = event.target.closest(".adopt");
    if (adoptButton) {
      petId = adoptButton.dataset.id;
      const petDiv = document.createElement("div");
      petDiv.classList.add("pets-hide");

      console.log(`Adopted pet with ID ${petId}`);
      petDiv.innerHTML = `
        <div class="cards-hide">
          <div class="pet-img-hide"><img src="${petImg}" alt="${petName}"></div>
          <div class="pet-name-hide"><div class="pet-div-row"<span id="pet-span">Nome: </span><h3>${petName}</h3></div></div>
          <div class="pet-race-hide"><div class="pet-div-row"<span id="pet-span">Raça: </span><h3>${petBreed}</h3></div></div>
          <div class="pet-age-hide"><div class="pet-div-row"<span id="pet-span">Idade do pet: </span><h3>${petAge} ano (s)</h3></div></div>
          <div class="pet-phoneNumber-hide"><div class="pet-div-row"<span id="pet-span">Telefone do dono para contato: </span><h3>${petPhoneNumber}</h3></div></div>
          <div class="pet-petInfo-hide"><div class="pet-div-row"<span id="pet-span">Informações sobre o pet: </span><p>${petsInfo}</p></div></div>
          <i class='bx bx-x div-close' id="bag-close"></i>
        </div>
      `;
      document.body.appendChild(petDiv);
      const closeDiv = document.querySelector('.div-close');

      closeDiv.addEventListener('click', () => {
        petDiv.remove();
      })

    }
  }
});

let tel = document.querySelector('#input-phone-number')
let labelTel = document.querySelector('#labelTelNumber')
let validTel = false

let nomes = document.querySelector('#input-pet-name')
let labelNome = document.querySelector('#labelPetName')
let validNome = false

tel.addEventListener('blur', () => {
  if (tel.value.length <= 14) {
    labelTel.setAttribute('style', 'color: red')
    showError('Telefone *Insira um número de telefone valido')
    tel.setAttribute('style', 'border-color: red')
    validTel = false
  } else if (telValidation(tel.value) !== true) {
    labelTel.setAttribute('style', 'color: red')
    showError('Telefone *O formato do número de telefone deve ser correto')
    tel.setAttribute('style', 'border-color: red')
    validTel = false
  } else {
    labelTel.setAttribute('style', 'color: green')
    tel.setAttribute('style', 'border-color: green')
    validTel = true
  }
})

nomes.addEventListener('blur', () => {
  if (nomes.value.length <= 2) {
    labelNome.setAttribute('style', 'color: red')
    showError('Nome *Insira no minimo 3 caracteres')
    nomes.setAttribute('style', 'border-color: red')
    validNome = false
  } else if (nameValidation(nomes.value) !== true) {
    labelNome.setAttribute('style', 'color: red')
    showError('Nome *Escreva um nome existente')
    nomes.setAttribute('style', 'border-color: red')
    validNome = false
  } else {
    labelNome.setAttribute('style', 'color: green')
    nomes.setAttribute('style', 'border-color: green')
    validNome = true
  }
})


function telValidation(tel) {
  let telPattern = /^\(?\d{2}\)?[- ]?\d{4,5}[- ]?\d{4}$/u
  return telPattern.test(tel);
}

function nameValidation(name) {
  let namePattern = /^([a-zA-Zà-úÀ-Ú]+[ ]{0,1}){1,}$/u
  return namePattern.test(name);
}

const telV = document.querySelector('#input-phone-number')

telV.addEventListener('keypress', () => {

  let telVlength = telV.value.length

  if (telVlength === 0) {
    telV.value += '('
  } else if (telVlength === 3) {
    telV.value += ') '
  } else if (telVlength === 10) {
    telV.value += '-'
  }
})

function isAuthenticated() {
  // Get the token from the cookies
  const token = getCookie("token");

  // Check if the token is valid
  if (token) {
    // TODO: Verify the token to ensure it is valid
    return true;
  }

  // If no token is present or the token is invalid, return false
  return false;
}

function getCookie(name) {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();

    // Check if this cookie is the one we're looking for
    if (cookie.startsWith(`${name}=`)) {
      return cookie.substring(name.length + 1);
    }
  }

  // If the cookie isn't found, return null
  return null;
}
