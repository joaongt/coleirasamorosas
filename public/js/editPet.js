function showInputFields() {
    const selectedOption = document.getElementById('select-edit-option').value;
    const nameInput = document.getElementById('input-pet-name');
    const ageInput = document.getElementById('input-pet-age');
    const typeInput = document.getElementById('input-pet-type');
    const breedInput = document.getElementById('input-pet-breed');
    const phoneInput = document.getElementById('input-phone-number');
    const infoInput = document.getElementById('input-pet-info');
    const imageInput = document.getElementById('input-pet-img');

    switch (selectedOption) {
        case 'name':
          nameInput.style.display = 'block';
          ageInput.style.display = 'none';
          typeInput.style.display = 'none';
          breedInput.style.display = 'none';
          phoneInput.style.display = 'none';
          infoInput.style.display = 'none';
          imageInput.style.display = 'none';
          break;
        case 'age':
          nameInput.style.display = 'none';
          ageInput.style.display = 'block';
          typeInput.style.display = 'none';
          breedInput.style.display = 'none';
          phoneInput.style.display = 'none';
          infoInput.style.display = 'none';
          imageInput.style.display = 'none';
          break;
        case 'type':
          nameInput.style.display = 'none';
          ageInput.style.display = 'none';
          typeInput.style.display = 'block';
          breedInput.style.display = 'none';
          phoneInput.style.display = 'none';
          infoInput.style.display = 'none';
          imageInput.style.display = 'none';
          break;
        case 'breed':
          nameInput.style.display = 'none';
          ageInput.style.display = 'none';
          typeInput.style.display = 'none';
          breedInput.style.display = 'block';
          phoneInput.style.display = 'none';
          infoInput.style.display = 'none';
          imageInput.style.display = 'none';
          break;
        case 'phone':
          nameInput.style.display = 'none';
          ageInput.style.display = 'none';
          typeInput.style.display = 'none';
          breedInput.style.display = 'none';
          phoneInput.style.display = 'block';
          infoInput.style.display = 'none';
          imageInput.style.display = 'none';
          break;
        case 'info':
          nameInput.style.display = 'none';
          ageInput.style.display = 'none';
          typeInput.style.display = 'none';
          breedInput.style.display = 'none';
          phoneInput.style.display = 'none';
          infoInput.style.display = 'block';
          imageInput.style.display = 'none';
          break;
        case 'image':
          nameInput.style.display = 'none';
          ageInput.style.display = 'none';
          typeInput.style.display = 'none';
          breedInput.style.display = 'none';
          phoneInput.style.display = 'none';
          infoInput.style.display = 'none';
          imageInput.style.display = 'block';
          break;
        default:
          nameInput.style.display = 'none';
          ageInput.style.display = 'none';
          typeInput.style.display = 'none';
          breedInput.style.display = 'none';
          phoneInput.style.display = 'none';
          infoInput.style.display = 'none';
          imageInput.style.display = 'none';
          break;
      }
}      