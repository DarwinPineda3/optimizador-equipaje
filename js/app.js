// Carga los elementos almacenados en localStorage o inicializa un arreglo vacío
const elements = JSON.parse(localStorage.getItem('elements')) || [];
let editIndex = null; // Índice del elemento que se está editando, si aplica

// Referencias a elementos del DOM
const elementsList = document.getElementById('elementsList');
const bestCombination = document.getElementById('bestCombination');
const addElementBtn = document.getElementById('addElementBtn');
const spinner = document.getElementById('spinner');

/**
 * Renderiza todos los elementos en la tabla.
 * Convierte cada objeto en una fila de la tabla HTML con botones de editar y eliminar.
 */
function renderElements() {
  elementsList.innerHTML = elements.map((el, index) => `
    <tr>
      <td>${el.name}</td>
      <td>${el.weight}</td>
      <td>${el.calories}</td>
      <td>
        <button class="btn btn-warning btn-sm me-2" onclick="editElement(${index})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="removeElement(${index})">Eliminar</button>
      </td>
    </tr>
  `).join('');
}

/**
 * Guarda el arreglo `elements` en localStorage como JSON.
 */
function saveElements() {
  localStorage.setItem('elements', JSON.stringify(elements));
}

/**
 * Limpia el formulario para añadir/editar elementos.
 */
function clearForm() {
  document.getElementById('elementName').value = '';
  document.getElementById('elementWeight').value = '';
  document.getElementById('elementCalories').value = '';
}

/**
 * Añade un nuevo elemento o actualiza uno existente según el valor de `editIndex`.
 */
function addOrUpdateElement() {
  const name = document.getElementById('elementName').value.trim();
  const weight = parseInt(document.getElementById('elementWeight').value);
  const calories = parseInt(document.getElementById('elementCalories').value);

  if (!name || isNaN(weight) || isNaN(calories)) {
    alert('Por favor completa todos los campos.');
    return;
  }

  const newElement = { name, weight, calories };

  if (editIndex === null) {
    // Si no se está editando, se agrega el nuevo elemento
    elements.push(newElement);
  } else {
    // Si se está editando, se actualiza el elemento correspondiente
    elements[editIndex] = newElement;
    editIndex = null;
    addElementBtn.textContent = "Agregar Elemento"; // Restaurar texto del botón
  }

  saveElements();     // Guardar en localStorage
  renderElements();   // Volver a mostrar la tabla actualizada
  clearForm();        // Limpiar el formulario
}

/**
 * Elimina un elemento del arreglo tras confirmar con el usuario.
 */
function removeElement(index) {
  if (confirm('¿Seguro que deseas eliminar este elemento?')) {
    elements.splice(index, 1);  // Elimina el elemento del arreglo
    saveElements();             // Guarda los cambios
    renderElements();           // Vuelve a renderizar la tabla
  }
}

/**
 * Carga los datos del elemento a editar en el formulario.
 */
function editElement(index) {
  const el = elements[index];
  document.getElementById('elementName').value = el.name;
  document.getElementById('elementWeight').value = el.weight;
  document.getElementById('elementCalories').value = el.calories;
  editIndex = index;
  addElementBtn.textContent = "Actualizar Elemento"; // Cambiar texto del botón
}

/**
 * Calcula la mejor combinación de elementos que cumplan con las restricciones:
 * Muestra un spinner de carga mientras procesa y luego muestra el resultado.
 */
function calculateBestCombination() {
  const minCalories = parseInt(document.getElementById('minCalories').value);
  const maxWeight = parseInt(document.getElementById('maxWeight').value);

  if (isNaN(minCalories) || isNaN(maxWeight)) {
    alert('Por favor especifica los valores de calorías mínimas y peso máximo.');
    return;
  }

  spinner.style.display = 'block';  // Mostrar spinner de carga
  bestCombination.innerHTML = '';   // Limpiar resultados anteriores

  setTimeout(() => {
    const n = elements.length;
    let bestCombo = null;
    let bestWeight = Infinity;

    // Genera todas las combinaciones posibles usando máscaras binarias
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

      // Verifica si la combinación cumple con las condiciones
      if (totalWeight <= maxWeight && totalCalories >= minCalories && totalWeight < bestWeight) {
        bestWeight = totalWeight;
        bestCombo = combo;
      }
    }

    // Muestra la mejor combinación encontrada o un mensaje si no hay ninguna
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

    spinner.style.display = 'none'; // Ocultar spinner
  }, 700); // Retardo simulado
}

// Asigna eventos a los botones del formulario
addElementBtn.addEventListener('click', addOrUpdateElement);
document.getElementById('calculateBtn').addEventListener('click', calculateBestCombination);

// Carga los elementos al cargar la página
renderElements();
