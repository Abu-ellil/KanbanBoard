const btnCom = document.querySelector(".btn-com");
const btnInPro = document.querySelector(".btn-in-pro");
const btnNotSt = document.querySelector(".btn-not-st");
const notStartList = document.querySelector(".notst");
const inProgList = document.querySelector(".inpro");
const completedtList = document.querySelector(".com");

let notStrTasks = JSON.parse(localStorage.getItem("not")) || [];
let inProgTasks = JSON.parse(localStorage.getItem("inpro")) || [];
let completedTasks = JSON.parse(localStorage.getItem("comp")) || [];

let editeEl = 'New Task';

let toDo = {
  id: Date.now(),
  text: "text",
};

// //////////FUNCTIONS START/////////
function displayData(arr, lst) {
  arr.forEach((itm) => {
    creatItem(lst, itm);
    dragItems();
    delEditBtns();
  });
}
///RESET Local
// const resetBtn = document.querySelector("#reset-btn");

// resetBtn.addEventListener("click", () => {
//   localStorage.clear();
//   // Reload the page after clearing local storage
//   location.reload();
// });
//////CREATE RANDOM NUMBER/////

function randNum() {
  return Math.floor(Math.random() * 100000);
}
///////ADD DATA TO LOCAL*/////
function addDataToLocal(Arraay, ky) {
  window.localStorage.setItem(`${ky}`, JSON.stringify(Arraay));
}
///////GET DATA From LOCAL*/////
function getDataFromLocal(kyy) {
  let data = window.localStorage.getItem(`${kyy}`);
  if (data) {
    let kyy = JSON.parse(data);
  }
}
//////////CREATEDELEMENT/////////

function creatItem(plac, dta) {
  plac.innerHTML += `<div class="draggable item" data-id="${toDo.id}" draggable="true"><input class="itemEel" value='${editeEl}'></input><div class="actions"><button class="material-icons edit">edit</button><button    class="material-icons remove-btn">remove_circle</button></div></div>`;
}
//////////CREATEDELEMENT/////////
//////////FUNCTIONS END/////////
//////////EVENTS START/////////
btnNotSt.addEventListener("click", () => {
  notStrTasks.push(toDo);
  creatItem(notStartList, toDo);
  dragItems();
  delEditBtns();
  save();
});
btnInPro.addEventListener("click", () => {
  inProgTasks.push(toDo);
  creatItem(inProgList, toDo);
  dragItems();
  delEditBtns();

  save();    
});
btnCom.addEventListener("click", () => {
  completedTasks.push(toDo);
  creatItem(completedtList, toDo);
  dragItems();
  delEditBtns();
  save();
});
//////////EDITE AND DELETE BUTTONS//////////



function delEditBtns() {
  const btnDel = document.querySelectorAll(".remove-btn");
  const btnEdt = document.querySelectorAll(".edit");
  btnEdt.forEach((btnE) => {
    btnE.addEventListener("click", (e) => {
      const current =
        e.target.parentElement.parentElement.querySelector(".itemEel");
      
current.textContent = 'sadasdasdsad'
      current.setAttribute("contenteditable", "true");
      current.focus();
      // Save the updated task when pressing enter key
    
    
    });
  });
  btnDel.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const currr = e.target.parentElement.parentElement;
      currr.remove();
      const taskId = currr.getAttribute("data-id");
      notStrTasks = JSON.parse(localStorage.getItem("not")) || [];
      inProgTasks = JSON.parse(localStorage.getItem("inpro")) || [];
      completedTasks = JSON.parse(localStorage.getItem("comp")) || [];
      const containers = document.querySelectorAll(".list-container");
      containers.forEach((container) => {
        const arr = container.classList.contains("notst")
          ? notStrTasks
          : container.classList.contains("inpro")
          ? inProgTasks
          : completedTasks;
        const index = arr.findIndex((t) => t === Number(taskId));
        if (index > -1) {
          arr.splice(index, 1);
          addDataToLocal(notStrTasks, "not");
          addDataToLocal(inProgTasks, "inpro");
          addDataToLocal(completedTasks, "comp");
        }
      });
    });
  });
}

//////////EVENTS END/////////
//////////DRAG&DROP START/////////
function dragItems() {
  const draggables = document.querySelectorAll(".draggable");
  const containers = document.querySelectorAll(".list-container");

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", (e) => {
      draggable.classList.add("dragging");
    });

    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");
      draggable.classList.remove("dragover");
      location.reload();
      // Update the array based on the new order of the tasks
      containers.forEach((container) => {
        let arr = [];
        const className = container.classList[1];
        if (className === "notst") {
          arr = notStrTasks;
        } else if (className === "inpro") {
          arr = inProgTasks;
        } else if (className === "com") {
          arr = completedTasks;
        }

        const ids = [...container.querySelectorAll(".draggable")].map((d) =>
          Number(d.getAttribute("data-id"))
        );
        const newOrder = ids.map((id) => arr.find((t) => t === id));

        // Update the corresponding array with the new order of tasks
        if (className === "notst") {
          notStrTasks = newOrder;
          addDataToLocal(notStrTasks, "not");
        } else if (className === "inpro") {
          inProgTasks = newOrder;
          addDataToLocal(inProgTasks, "inpro");
        } else if (className === "com") {
          completedTasks = newOrder;
          addDataToLocal(completedTasks, "comp");
        }
        container.addEventListener("dragleave", (e) => {
          draggable.classList.remove("dragover");
        });
      });

      // Save the updated order of tasks to local storage

      filterArray(inProgTasks);
      save();
    });
  });

  containers.forEach((container) => {
    container.addEventListener("dragover", (e) => {
      e.preventDefault();
      if (e.target.classList.contains("item")) {
        e.target.classList.add("dragover");
      }
      const afterElement = getDragAfterElement(container, e.clientY);
      const draggable = document.querySelector(".dragging");
      if (!afterElement) {
        container.appendChild(draggable);
      } else {
        container.insertBefore(draggable, afterElement);
      }
    });

    container.addEventListener("drop", (e) => {
      e.preventDefault();
      if (e.target.classList.contains("item")) {
        e.target.classList.add("dragover");
      }
      const afterElement = getDragAfterElement(container, e.clientY);
      const draggable = document.querySelector(".dragging");
      if (!afterElement) {
        container.appendChild(draggable);
      } else {
        container.insertBefore(draggable, afterElement);
      }
    });
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".draggable:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

//////////DRAG&DROP END/////////
displayData(notStrTasks, notStartList);
displayData(completedTasks, completedtList);
displayData(inProgTasks, inProgList);

getDataFromLocal("not");
getDataFromLocal("inpro");
getDataFromLocal("comp");

function save() {
  addDataToLocal(notStrTasks, "not");
  addDataToLocal(inProgTasks, "inpro");
  addDataToLocal(completedTasks, "comp");
}

function filterArray(arrray) {
  arrray = arrray.filter((arr) => arr !== null);
}

function deleteTaskWithnot(taskId) {
  notStrTasks = notStrTasks.filter((task) => task.id != taskId);
  save();
}

function deleteTaskWithinpr(taskId) {
  inProgTasks = inProgTasks.filter((task) => task.id != taskId);
  save();
}

function deleteTaskWith(taskId) {
  completedTasks = completedTasks.filter((task) => task.id != taskId);
  save();
}
