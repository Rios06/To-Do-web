/*TIPS: *No olvides utilizar el almacenamiento local (localStorage)
 para que las tareas queden guardadas en caso
 de que la aplicación se cierre.*/
 const itemsArray = localStorage.getItem("items")
 ? JSON.parse(localStorage.getItem('items'))
 : []


//El sistema debe permitir AGREGAR una o varias tareas tarea.
function crearItems (Tarea) {
  const creadoItems = {
   thing: Tarea.value,
   checked: false,
    prioridad:"alta",
    categoria:"casa",
  }

  itemsArray.push(creadoItems)
  localStorage.setItem('items', JSON.stringify(itemsArray))
  location.reload();
}


function correTiempo() {
  let date = new Date()
  let hh = date.getHours()
  let mm = date.getMinutes()
  let ss = date.getSeconds()
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();


 hh = (hh < 10) ? "0" + hh : hh
 mm = (mm < 10) ? "0" + mm : mm
 ss = (ss < 10) ? "0" + ss : ss
 day = (day < 10) ? "0" + day : day;
 month = (month < 10) ? "0" + month : month;

 let time = hh + ":" + mm + ":" + ss;
 let dateStr = year + "-" + month + "-" + day;
 let watch = document.querySelector('#watch')
 let dateDisplay = document.querySelector('#date-display');
 watch.innerHTML = time
 dateDisplay.innerHTML = dateStr;
}

setInterval(correTiempo,1000);

// Codigo DOM #1
document.querySelector('.new-todo').addEventListener('keyup', (event) => {
  if (
    event.keyCode === 13 &&
    document.querySelector('.new-todo').value.length > 0
  ) {
    const item = document.querySelector('.new-todo')
    crearItems(item)
    //Llamar la función que crea la tarea.**
  }
})


function displayItems() {
  let items = ''
  for (let i = 0; i < itemsArray.length; i++) {
    const isChecked = itemsArray[i].checked ? 'checked' : '';
    const tachadoClass = itemsArray[i].checked ? 'tachado' : '';
    items += `    <div class="item">
                    <div class="input-controller">
                      <input class="toggle" type="checkbox" id="check_${i}" ${
      itemsArray[i].checked ? 'checked' : ''
    } />
                      <textarea disabled class="${tachadoClass}">${itemsArray[i].thing}</textarea>
                      <div class="edit-controller">
                        <div>
                          Prioridad
                          <select id="priority">
                            <option ${
                              itemsArray[i].priority === 'Alta'
                                ? 'selected'
                                : ''
                            }>Alta</option>
                            <option ${
                              itemsArray[i].priority === 'Media'
                                ? 'selected'
                                : ''
                            }>Media</option> 
                            <option ${
                              itemsArray[i].priority === 'Baja'
                                ? 'selected'
                                : ''
                            }>Baja</option> 
                          </select>
                        </div>
                        <div>
                          Categorías
                          <select id="category">
                              <option ${
                                itemsArray[i].category === 'Casa'
                                  ? 'selected'
                                  : ''
                              }>Casa</option> 
                              <option ${
                                itemsArray[i].category === 'Trabajo'
                                  ? 'selected'
                                  : ''
                              }>Trabajo</option> 
                              <option ${
                                itemsArray[i].category === 'Emprendimiento'
                                  ? 'selected'
                                  : ''
                              }>Emprendimiento</option> 
                            </select>
                        </div>
                        <i class="fa-solid fa-pen-to-square editBtn"></i>
                        <i class="fa-solid fa-x deleteBtn"></i>
                      </div>
                    </div>
                    <div class="update-controller">
                    <button class="saveBtn">Save</button>
                     <button class="cancelBtn">Cancel</button>
                    </div>
                  </div>`
  }
  document.querySelector('.todo-list').innerHTML = items
  activateCheckboxListeners()
  activateDeleteListeners()
  activateEditListeners()
  activateSaveListeners()
  activateCancelListeners()
}

function displayFooter() {
  let page = `      
     
      <footer class="footer">
       
        <span class="todo-count"><strong>${countPend()}</strong> pendiente(s)</span>
        
        <ul class="filters">
          <li>
            <a onclick="showAll() "class="selected filtro" href="#/">Todos</a>
          </li>
          <li>
            <a onclick="showPend()" class="filtro" href="#/active">Pendientes</a>
          </li>
          <li>
            <a onclick="showComp()" class="filtro" href="#/completed">Completados</a>
          </li>
        </ul>
        <button onclick="borrarCompletados()" id="clear-completed" class="clear-completed">Borrar completados</button>
      </footer>
    `
  document.querySelector('.footer').innerHTML = page
}



// Codigo DOM #2
// este fragmento permite conservar el estado del checkbox (true o false) en el localStorage

function activateCheckboxListeners() {
  const checkboxes = document.querySelectorAll('.toggle')
  checkboxes.forEach((ch, i) => {
    ch.addEventListener('click', () => {
  
      itemsArray[i].checked = ch.checked
      localStorage.setItem('items', JSON.stringify(itemsArray))

const textarea = document.querySelectorAll('.input-controller textarea')[i];

if (ch.checked) {
  textarea.classList.add('tachado');

} else {
  textarea.classList.remove('tachado');
}


    })
  })
}
// Codigo DOM #3
// Permite que la acción eliminar impacte el DOM del HTML, acá debes agegar algoritmo de eliminar tarea

function activateDeleteListeners() {
  let deleteBtn = document.querySelectorAll('.deleteBtn')
  deleteBtn.forEach((db, i) => {
    db.addEventListener('click', () => {
  borrarItem(i)
      //Llamar la función que elimina la tarea
    })
 
  })
}

function borrarItem(i) {
  if (i >= 0 && i < itemsArray.length) {
    itemsArray.splice(i, 1);
    localStorage.setItem('items', JSON.stringify(itemsArray))
  location.reload()
  }
}

// Codigo DOM #4

// Permite que la acción editar de las 2 listas desplegables "prioridad" y "categoría" impacte el DOM del HTML cuando cambies de opción, inserta este código tal cual, el reto está en saber en qué parte de tu código debes usarlo.

function activateEditListeners() {
  const editBtn = document.querySelectorAll('.editBtn')
  const updateController = document.querySelectorAll('.update-controller')
  const inputs = document.querySelectorAll('.input-controller textarea')
  const prioritySelects = document.querySelectorAll(
    '.edit-controller select'
  )[0]
  const categorySelects = document.querySelectorAll(
    '.edit-controller select'
  )[1]

  editBtn.forEach((eb, i) => {
    eb.addEventListener('click', () => {
      updateController[i].style.display = 'block'
      inputs[i].disabled = false

      prioritySelects.value = itemsArray[i].priority
      categorySelects.value = itemsArray[i].category
    })
  })

   // Constante y forEach para dejar la prioridad marcada y guardada 

 const guardarPrioridad = document.querySelectorAll('#priority');

 guardarPrioridad.forEach((s, i) => {
   s.addEventListener('change', ({ target: { value } }) => {
     itemsArray[i].priority = value;
     localStorage.setItem('items', JSON.stringify(itemsArray));
   });
 });

 // Funcion para separar la categoria y hacerla posible 

 const selectC = document.querySelectorAll('#category');

function handleCategoryChange(event, index) {
 itemsArray[index].category = event.target.value;
 localStorage.setItem('items', JSON.stringify(itemsArray));
}

selectC.forEach((s, i) => {
 s.addEventListener('change', (event) => {
   handleCategoryChange(event, i);
 });
});


  prioritySelects.addEventListener('change', (event) => {
    const selectedIndex = event.target.selectedIndex
    itemsArray[i].priority = event.target.options[selectedIndex].text
    localStorage.setItem('items', JSON.stringify(itemsArray))
  })

  categorySelects.addEventListener('change', (event) => {
    const selectedIndex = event.target.selectedIndex
    itemsArray[i].category = event.target.options[selectedIndex].text
    localStorage.setItem('items', JSON.stringify(itemsArray))
  })
}


// Codigo DOM #5
// Permite que la acción guardar el nuevo nombre de la tarea cuando decides editar y que impacte el DOM del HTML, acá debes agegar algoritmo de actualizar tarea

function activateSaveListeners() {
  const saveBtn = document.querySelectorAll('.saveBtn')
  const inputs = document.querySelectorAll('.input-controller textarea')
  saveBtn.forEach((sB, i) => {
    sB.addEventListener('click', () => {
      MODIFICARitem(inputs[i].value,i)
      // Llamar la función que guarda la actualización tarea
    })
  })
}

function modificarItem(text, i) {
  if (i >= 0 && i < itemsArray.length) {
    itemsArray[i].thing = text;
    guardarItemsEnLocalStorage();
  } else {
    console.error("Índice inválido");
  }
}

function guardarItemsEnLocalStorage() {
  localStorage.setItem('items', JSON.stringify(itemsArray));
  location.reload();
}

// Codigo DOM #6
// Esta es la lógica para el botón "cancelar" cuando presionas editar una tarea, inserta este código tal cual, el reto está en saber en qué parte de tu código debes usarlo.

function activateCancelListeners() {
  const cancelBtn = document.querySelectorAll('.cancelBtn')
  const updateController = document.querySelectorAll('.update-controller')
  const inputs = document.querySelectorAll('.input-controller textarea')
  
  cancelBtn.forEach((cB, i) => {
    cB.addEventListener('click', () => {
      updateController[i].style.display = 'none'
      inputs[i].disabled = true
      inputs[i].style.border = 'none'
    })
  
  })
}


function countPend(){
  const contadorPendientes= itemsArray.filter((text) => text.checked===false)

  return contadorPendientes.length
}



//El sistema deber permitir MARCAR una tarea como completada
function showComp() {
  const completados = document.querySelectorAll('.input-controller');

  completados.forEach((element) => {
    const check = element.querySelector('.toggle');
    element.style.display = check.checked ? '' : 'none';
  });

  localStorage.setItem('items', JSON.stringify(itemsArray));
}

function borrarCompletados() {
  for (let i = itemsArray.length - 1; i >= 0; i--) {
    if (itemsArray[i].checked === true) {
      itemsArray.splice(i, 1);
    }
  }

  localStorage.setItem('items', JSON.stringify(itemsArray));
  location.reload();
}

function showAll(){
  const all = document.querySelectorAll('.input-controller');
  all.forEach((element) => {
    const check = element.querySelector('.toggle');

    element.style.display = ''
  })

  localStorage.setItem('items' , JSON.stringify(itemsArray));
}

function showPend() {
  const pendientes = document.querySelectorAll('.input-controller');
  pendientes.forEach(element => {
    const check = element.querySelector('.toggle');
    element.style.display = check.checked ? 'none' : '';
  });
  localStorage.setItem('items', JSON.stringify(itemsArray));
}



displayItems()
displayFooter()

//El sistema debe permitir dar diferentes PRIORIDADES a las tareas
//EJEMPLO:

//Sacar la basura - Prioridad: media

//El sistema debe permitir visualizar tareas por CATEGORÍAS o ETIQUETAS
//EJEMPLO:

/*Categorías disponibles: PENDIENTE, COMPLETADO o TODASE.T.C */


