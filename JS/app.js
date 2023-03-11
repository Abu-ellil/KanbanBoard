// Data model for the cards
const data = {
  todo: [],
  "in-progress": [],
  done: [],
};

// Get the columns and add buttons
const columns = document.querySelectorAll(".column");
const addButtons = document.querySelectorAll(".add-card");

// Load saved data from localStorage
const savedData = localStorage.getItem("kanbanData");
if (savedData) {
  Object.assign(data, JSON.parse(savedData));
}

// Render the cards from the data model
function renderCards() {
  for (const columnId in data) {
    const column = document.getElementById(columnId);
    const cardsContainer = column.querySelector(".cards");
    cardsContainer.innerHTML = "";
    data[columnId].forEach((card, index) => {
      const cardEl = document.createElement("li");
      cardEl.classList.add("card");

      cardEl.addEventListener("dragstart", handleDragStart);
      cardEl.addEventListener("dragover", handleDragOver);
      cardEl.addEventListener("drop", handleDrop);
      cardEl.addEventListener("dragend", handleDragEnd);
      cardEl.addEventListener("dragleave", handleDragLeave);
      cardEl.setAttribute("draggable", true);
      //DRG&DRB//
      cardEl.innerHTML = `
        <div class="card-header">
          <div class="card-title">${card.title}</div>
          <div class="card-actions">
            <button class="edit-card material-icons edit" data-column="${columnId}" data-index="${index}">edit</button>
            <button class="delete-card  material-icons remove-btn" data-column="${columnId}" data-index="${index}">remove_circle</button>
          </div>
        </div>
        
      `;
      cardsContainer.appendChild(cardEl);
    });
  }
}

// Save the data model to localStorage
function saveData() {
  localStorage.setItem("kanbanData", JSON.stringify(data));
}

// Add a new card to the data model and render it
function addCard(columnId, card) {
  data[columnId].push(card);
  saveData();
  renderCards();
}

// Load saved data from localStorage and render the cards
window.addEventListener("load", () => {
  renderCards();
});

// Add event listeners to the add buttons
addButtons.forEach((button) => {
  const columnId = button.getAttribute("data-column");
  button.addEventListener("click", () => {
    const title = prompt("Enter a title for the new card:");
    const card = { title };
    addCard(columnId, card);
  });
});

// Add event listeners to the edit and delete buttons
document.addEventListener("click", (event) => {
  const { target } = event;
  if (target.classList.contains("edit-card")) {
    event.preventDefault();
    const columnId = target.getAttribute("data-column");
    const index = target.getAttribute("data-index");
    const card = data[columnId][index];
    const newTitle = prompt("Enter a new title for the card:", card.title);

    data[columnId][index] = { title: newTitle };
    saveData();
    renderCards();
  } else if (target.classList.contains("delete-card")) {
    event.preventDefault();
    const columnId = target.getAttribute("data-column");
    const index = target.getAttribute("data-index");
    data[columnId].splice(index, 1);
    saveData();
    renderCards();
  }
});

// //DRG&DRP//


let draggedCard = null;

function handleDragStart(event) {
  draggedCard = this;
  event.dataTransfer.setData("text/plain", ""); // this just required for Firefox
  this.classList.add("dragging");
}

function handleDragOver(event) {
  event.preventDefault();
  this.classList.add("dragover");
}

function handleDrop(event) {
  event.preventDefault();
  const sourceColumnId = draggedCard.parentNode.parentNode.id;
  const targetColumnId = this.parentNode.parentNode.id;
  const sourceIndex = Array.from(draggedCard.parentNode.children).indexOf(
    draggedCard
  );
  const targetIndex = Array.from(this.parentNode.children).indexOf(this);
  if (sourceColumnId === targetColumnId) {
    data[sourceColumnId].splice(
      targetIndex,
      0,
      data[sourceColumnId].splice(sourceIndex, 1)[0]
    );
  } else {
    data[targetColumnId].splice(
      targetIndex,
      0,
      data[sourceColumnId][sourceIndex]
    );
    data[sourceColumnId].splice(sourceIndex, 1);
  }
  saveData();
  renderCards();
}

function handleDragEnd(event) {
  this.classList.remove("dragging");
  this.classList.remove("dragover");
}

function handleDragLeave(event) {
  this.classList.remove("dragging");
  this.classList.remove("dragover");
}

////////////////////////////



const containers = document.querySelectorAll(".cards");

for (let j = 0; j < containers.length; j++) {
  const list = containers[j];

  list.addEventListener("dragover", function (e) {
    e.preventDefault();
  });

  list.addEventListener("dragenter", function (e) {
    e.preventDefault();
    this.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
  });

  list.addEventListener("dragleave", function (e) {
    this.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
  });

  list.addEventListener("drop", function (e) {
    console.log("drop");
    this.append(draggedCard);
    this.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
  });
}
