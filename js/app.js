const elements = JSON.parse(localStorage.getItem('elements')) || [];
let editIndex = null;

const elementsList = document.getElementById('elementsList');
const bestCombination = document.getElementById('bestCombination');
const addElementBtn = document.getElementById('addElementBtn');

function renderElements() {
  elementsList.innerHTML = '';
  elements.forEach((el, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${el.name}</td>
      <td>${el.weight}</td>
      <td>${el.calories}</td>
      <td>
        <button class="btn btn-warning btn-sm me-2" onclick="editElement(${index})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="removeElement(${index})">Eliminar</button>
      </td>
    `;
    elementsList.appendChild(row);
  });
}

function saveElements() {
  localStorage.setItem('elements', JSON.stringify(elements));
}

function addOrUpdateElement() {
  const name = document.getElementById('elementName').value.trim();
  const weight = parseInt(document.getElementById('elementWeight').value);
  const calories = parseInt(document.getElementById('elementCalories').value);

  if (!name || isNaN(weight) || isNaN(calories)) {
    alert('Por favor completa todos los campos.');
    return;
  }

  if (editIndex === null) {
    // Agregar nuevo elemento
    elements.push({ name, weight, calories });
  } else {
    // Actualizar elemento existente
    elements[editIndex] = { name, weight, calories };
    editIndex = null;
    addElementBtn.textContent = "Agregar Elemento";
  }

  saveElements();
  renderElements();
  clearForm();
}

function removeElement(index) {
  if (confirm('¿Seguro que deseas eliminar este elemento?')) {
    elements.splice(index, 1);
    saveElements();
    renderElements();
  }
}

function editElement(index) {
  const el = elements[index];
  document.getElementById('elementName').value = el.name;
  document.getElementById('elementWeight').value = el.weight;
  document.getElementById('elementCalories').value = el.calories;
  editIndex = index;
  addElementBtn.textContent = "Actualizar Elemento";
}

function clearForm() {
  document.getElementById('elementName').value = '';
  document.getElementById('elementWeight').value = '';
  document.getElementById('elementCalories').value = '';
}

function calculateBestCombination() {
  const minCalories = parseInt(document.getElementById('minCalories').value);
  const maxWeight = parseInt(document.getElementById('maxWeight').value);

  if (isNaN(minCalories) || isNaN(maxWeight)) {
    alert('Por favor especifica los valores de calorías mínimas y peso máximo.');
    return;
  }

  const n = elements.length;
  let bestCombo = null;
  let bestWeight = Infinity;

  for (let mask = 0; mask < (1 << n); mask++) {
    let totalWeight = 0;
    let totalCalories = 0;
    const combo = [];

    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        totalWeight += elements[i].weight;
        totalCalories += elements[i].calories;
        combo.push(elements[i]);
      }
    }

    if (totalWeight <= maxWeight && totalCalories >= minCalories) {
      if (totalWeight < bestWeight) {
        bestWeight = totalWeight;
        bestCombo = combo;
      }
    }
  }

  bestCombination.innerHTML = '';
  if (bestCombo) {
    bestCombo.forEach(item => {
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      li.textContent = `${item.name} - Peso: ${item.weight}, Calorías: ${item.calories}`;
      bestCombination.appendChild(li);
    });
  } else {
    bestCombination.innerHTML = '<li class="list-group-item">No hay combinación válida.</li>';
  }
}

function calculateBestCombination() {
  const minCalories = parseInt(document.getElementById('minCalories').value);
  const maxWeight = parseInt(document.getElementById('maxWeight').value);

  if (isNaN(minCalories) || isNaN(maxWeight)) {
    alert('Por favor especifica los valores de calorías mínimas y peso máximo.');
    return;
  }

  //spiner

  document.getElementById('spinner').style.display = 'block'; 
  bestCombination.innerHTML = '';

  setTimeout(() => {
    const n = elements.length;
    let bestCombo = null;
    let bestWeight = Infinity;

    for (let mask = 0; mask < (1 << n); mask++) {
      let totalWeight = 0;
      let totalCalories = 0;
      const combo = [];

      for (let i = 0; i < n; i++) {
        if (mask & (1 << i)) {
          totalWeight += elements[i].weight;
          totalCalories += elements[i].calories;
          combo.push(elements[i]);
        }
      }

      if (totalWeight <= maxWeight && totalCalories >= minCalories) {
        if (totalWeight < bestWeight) {
          bestWeight = totalWeight;
          bestCombo = combo;
        }
      }
    }

    if (bestCombo) {
      bestCombo.forEach(item => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = `${item.name} - Peso: ${item.weight}, Calorías: ${item.calories}`;
        bestCombination.appendChild(li);
      });
    } else {
      bestCombination.innerHTML = '<li class="list-group-item">No hay combinación válida.</li>';
    }

    document.getElementById('spinner').style.display = 'none'; 
  }, 700); 
}

addElementBtn.addEventListener('click', addOrUpdateElement);
document.getElementById('calculateBtn').addEventListener('click', calculateBestCombination);

renderElements();
