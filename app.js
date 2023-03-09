const btnCom = document.querySelector(".btn-com");
const btnInPro = document.querySelector(".btn-in-pro");
const btnNotSt = document.querySelector(".btn-not-st");
const notStartList = document.querySelector(".notst");
const inProgList = document.querySelector(".inpro");
const completedtList = document.querySelector(".com");

let notStrTasks = JSON.parse(localStorage.getItem("not")) || [];
let inProgTasks = JSON.parse(localStorage.getItem("inpro")) || [];
let completedTasks = JSON.parse(localStorage.getItem("comp")) || [];

let toDo = {
  id: Date.now(),
  text: "New Task",
};

// //////////FUNCTIONS START/////////
function displayData(arr, lst) {
  arr.forEach((itm) => {
    creatItem(lst, itm);
    dragItems();
    delEditBtns();
  });
}

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
{
  /* 
       <div class="draggable item" draggable="true"><div class="item">CONTENT HERE</div><div class="actions"><button class="material-icons edit">edit</button><button class="material-icons remove-btn">remove_circle</button></div></div>
*/
}
function creatItem(plac, dta) {
  plac.innerHTML += `<div class="draggable item" data-id="${dta.id}" draggable="true"><div class="itemEel">${dta.text}</div><div class="actions"><button class="material-icons edit">edit</button><button    class="material-icons remove-btn">remove_circle</button></div></div>`;
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
  //////EDIT
  btnEdt.forEach((btnE) => {
    btnE.addEventListener("click", (e) => {
      const current =
        e.target.parentElement.parentElement.querySelector(".itemEel");
      current.setAttribute("contenteditable", "true");
      current.focus();
      dragItems();
    });
  });
  /////DELETE
  btnDel.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      currr = e.target.parentElement.parentElement;
      currr.remove();
      let ID = currr.getAttribute("data-id");
      console.log(JSON.parse(localStorage.getItem("not")));
      notStrTasks = JSON.parse(localStorage.getItem("not"));
      const containerrs = document.querySelectorAll(".list-container");

      containerrs.forEach((cont) => {
        if (cont.classList.contains("notst")) {
          deleteTaskWithnot(
            e.target.parentElement.parentElement.getAttribute("data-id")
          );
        } else if (cont.classList.contains("inpro")) {
          deleteTaskWithinpr(
            e.target.parentElement.parentElement.getAttribute("data-id")
          );
        }
        if (cont.classList.contains("com")) {
          deleteTaskWith(
            e.target.parentElement.parentElement.getAttribute("data-id")
          );
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
      save();
    });
    draggable.addEventListener("dragleave", () => {
      draggable.classList.remove("dragover");
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
