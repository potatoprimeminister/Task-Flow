const board = document.querySelector(".board");
const listInputSection = document.getElementById("listInputSection");
const showAddListBtn = document.getElementById("showAddListBtn");
const listInputBox = document.getElementById("listInputBox");

/*LIST INPUT TOGGLE */

function toggleListInput() {
    listInputSection.classList.toggle("hidden");
    showAddListBtn.classList.toggle("hidden");
}

/*ADD LIST */

function addList() {
    const listTitle = listInputBox.value.trim();

    if (!listTitle) {
        alert("You must write something");
        return;
    }

    const newList = document.createElement("div");
    newList.className = "list";

    newList.innerHTML = `
        <div class="name">
            <h1>${listTitle}</h1>
            <i class="fa-solid fa-trash"></i>
        </div>
        <div class="card">
            <ul class="listContainer"></ul>

            <div class="cardInput hidden">
                <input type="text" placeholder="Enter a title for this card" class="inputBox">
                <div class="cardButtons">
                    <button class="addCardBtn addCard primaryBtn">Add card</button>
                    <button class="addCardBtn cancelCard">
                        <i class="fa-solid fa-x"></i>
                    </button>
                </div>
            </div>

            <button class="addCardBtn showCardInput">
                <i class="fa-solid fa-plus"></i>
                Add a card
            </button>
        </div>
    `;

    board.insertBefore(newList,board.querySelector("#showAddListBtn"));

    listInputBox.value = "";
    toggleListInput();
}

/*GLOBAL CLICK HANDLER */

document.addEventListener("click", function (e) {

    // Show card input
    if (e.target.closest(".showCardInput")) {
        const card = e.target.closest(".card");
        card.querySelector(".cardInput").classList.remove("hidden");
        e.target.closest(".showCardInput").classList.add("hidden");
    }

    // Cancel card input
    if (e.target.closest(".cancelCard")) {
        const card = e.target.closest(".card");
        card.querySelector(".cardInput").classList.add("hidden");
        card.querySelector(".showCardInput").classList.remove("hidden");
    }

    // Add card
    if (e.target.closest(".addCard")) {
        const card = e.target.closest(".card");
        const input = card.querySelector(".inputBox");
        const ul = card.querySelector(".listContainer");

        const task = input.value.trim();

        if (!task) {
            alert("You must write something");
            return;
        }

        const li = document.createElement("li");
        li.textContent = task;

        li.setAttribute("draggable", "true");

        const span = document.createElement("span");
        span.innerHTML = '<i class="fa-solid fa-trash"></i>';
        li.appendChild(span);

        ul.appendChild(li);

        input.value = "";
        card.querySelector(".cardInput").classList.add("hidden");
        card.querySelector(".showCardInput").classList.remove("hidden");
    }

    // Delete or check card
    if (e.target.closest("li")) {
        const li = e.target.closest("li");

        if (e.target.closest("span")) {
            li.remove();
        } else {
            li.classList.toggle("checked");
        }
    }
    // Delete entire list
    if (e.target.closest(".name i")) {
        const list = e.target.closest(".list");
        list.remove();
    }

    saveData()
});

let draggedItem = null;

document.addEventListener("dragstart", function (e) {
    if (e.target.tagName === "LI") {
        draggedItem = e.target;
        setTimeout(() => {
            e.target.style.display = "none";
        }, 0);
    }
});

document.addEventListener("dragover", function (e) {
    if (e.target.closest(".listContainer")) {
        e.preventDefault(); // IMPORTANT
    }
});

document.addEventListener("drop", function (e) {
    const ul = e.target.closest(".listContainer");

    if (ul && draggedItem) {
        ul.appendChild(draggedItem);
        draggedItem.style.display = "flex";
        draggedItem = null;

        saveData();
    }
});

document.addEventListener("dragend", function (e) {
    if (draggedItem) {
        draggedItem.style.display = "flex";
        draggedItem = null;
    }
});

/* LIST BUTTON HANDLING*/

document.getElementById("showAddListBtn").addEventListener("click", toggleListInput);

document.getElementById("listHiddenBtn").addEventListener("click", addList);

document.querySelector("#listInputSection .addListBtn:last-child")
    .addEventListener("click", toggleListInput);

function saveData() {
    const lists = document.querySelectorAll(".list");
    localStorage.setItem("boardData", [...lists].map(list => list.outerHTML).join(""));
}

function showBoard() {
    const data = localStorage.getItem("boardData");
    if (data) {
        board.insertAdjacentHTML("afterbegin", data);
    }

    // Make restored cards draggable
    document.querySelectorAll("li").forEach(li => {
        li.setAttribute("draggable", "true");
    });
}

showBoard()



