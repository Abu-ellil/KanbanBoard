const taskLists = document.querySelectorAll(".cards");
const sections = document.querySelectorAll(".column");

let targetSection;
let touchStartX, touchStartY;

// Add touch event listeners to draggable items
taskLists.forEach((task) => {
  // Touch event handler for starting a drag
  task.addEventListener("touchstart", function (event) {
    if (event.target.nodeName === "INPUT") return;
    if (event.target.classList.contains("icon")) return;

    dragging = event.target.closest(".card");

    // Store the initial touch coordinates
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;

    // Add dragging class to dragged item
    dragging.classList.add("dragging");
  });

  // Touch event handler for ending a drag
  task.addEventListener("touchend", function (event) {
    let touch = event.changedTouches[0];

    // Check if user dragged the element or just touched it
    if (touch.clientY === touchStartY) {
      dragging.classList.remove("dragging");
      return;
    }

    let minDistance = Infinity;
    for (let i = 0; i < sections.length; i++) {
      let section = sections[i];
      let rect = section.getBoundingClientRect();
      let distance = Math.hypot(
        touch.clientX - rect.left - rect.width / 2,
        touch.clientY - rect.top - rect.height / 2
      );
      if (distance < minDistance) {
        minDistance = distance;
        targetSection = section;
      }
    }

    // Remove dragging class from dragged item
    if (!dragging) return;
    dragging.classList.remove("dragging");
    event.target.closest(".column").classList.remove("dragover");

    // Move the dragged item to the target section's task list
    targetSection.querySelector(".cards").appendChild(dragging);

    // Return to normal styles
    sections.forEach((section) => section.classList.remove("dragover"));
    dragging.style.transform = `translate(0, 0)`;

    dragging = null;

    saveData();
    // renderCards();
  });
});

// Add touch event listeners to sections for drag over and drag leave
sections.forEach((section) => {
  section.addEventListener("touchmove", touchMove);
  section.addEventListener("touchleave", touchLeave);
});

function touchMove(event) {
  event.preventDefault();

  // Finde closest section to movement
  let touch = event.touches[0];
  let endX = touch.pageX;
  let endY = touch.pageY;
  let distanceMoved = Math.hypot(endX - touchStartX, endY - touchStartY);
  if (distanceMoved > 10) {
    // adjust this threshold as needed
    let minDistance = Infinity;
    for (let i = 0; i < sections.length; i++) {
      let section = sections[i];
      let rect = section.getBoundingClientRect();
      let distanceToSection = Math.hypot(
        touch.clientX - rect.left - rect.width / 2,
        touch.clientY - rect.top - rect.height / 2
      );
      if (distanceToSection < minDistance) {
        minDistance = distanceToSection;
        targetSection = section;
      }
    }
  }

  // Calculate the distance the finger has moved since the touch start
  const touchX = event.touches[0].clientX;
  const touchY = event.touches[0].clientY;
  const deltaX = touchX - touchStartX;
  const deltaY = touchY - touchStartY;

  if (!dragging) return;
  // Move the dragged item using CSS transform
  dragging.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

  // Add dragover class to the section
  targetSection.classList.add("dragover");
}

function touchLeave(event) {
  // Remove dragover class from the section
  event.target.closest(".column").classList.remove("dragover");
}

//////////////////////////////////////////

let currentLi = null;
let initialPos = null;
let currentPos = null;
let diff = 0;
isTouchMoving = false;

function handleTouchStart(event) {
  if (event.target.nodeName === "INPUT") return;
  if (event.target.classList.contains("icon")) return;

  currentLi = event.target.closest(".task");
  if (!currentLi) return;

  initialPos = event.touches[0].clientY;
  isTouchMoving = false;
}

function handleTouchMove(event) {
  event.preventDefault();

  if (event.target.nodeName === "INPUT") return;
  if (event.target.classList.contains("icon")) return;

  if (!currentLi) return;

  currentPos = event.touches[0].clientY;
  diff = currentPos - initialPos;

  if (Math.abs(diff) < 10) return;

  isTouchMoving = true;

  currentLi.style.transform = `translateY(${diff}px)`;

  const ul = currentLi.closest(".cards");
  const liArray = [...ul.querySelectorAll(".task")];

  for (const li of liArray) {
    if (li === currentLi) continue;

    const rect = li.getBoundingClientRect();
    const mid = (rect.bottom + rect.top) / 2;

    if (currentPos > mid) {
      li.classList.add("hover-below");
      li.classList.remove("hover-above");
    } else {
      li.classList.add("hover-above");
      li.classList.remove("hover-below");
    }
  }
}

function handleTouchEnd() {
  if (Math.abs(diff) < 10 || !isTouchMoving) return;
  if (!currentLi) return;

  currentLi.style.transform = "";

  const ul = currentLi.closest(".cards");
  const liArray = [...ul.querySelectorAll(".task")];
  const newIndex = liArray.indexOf(currentLi);

  let i = 0;
  for (const li of liArray) {
    if (li === currentLi) continue;

    const rect = li.getBoundingClientRect();
    const mid = (rect.bottom + rect.top) / 2;

    if (currentPos > mid && newIndex > i) i++;
    if (currentPos < mid && newIndex < i) i--;
  }

  ul.insertBefore(currentLi, liArray[i]);

  document
    .querySelectorAll(".task")
    .forEach((t) => t.classList.remove("hover-above", "hover-below"));

  currentLi = null;
  initialPos = null;
  currentPos = null;
  diff = 0;
}

taskLists.forEach((taskList) => {
  taskList.addEventListener("touchstart", handleTouchStart);
  taskList.addEventListener("touchmove", handleTouchMove);
  taskList.addEventListener("touchend", handleTouchEnd);
});
