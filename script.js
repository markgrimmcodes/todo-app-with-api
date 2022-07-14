const addTodoBtn = document.querySelector("#addButton");
const removeTodoBtn = document.querySelector("#removeButton");
const newTodoInput = document.querySelector("#todoText");
const todoList = document.querySelector("#todoList");

let todos = [];

function loadTodos() {
  fetch("http://localhost:4730/todos")
    .then((response) => response.json())
    .then((todosFromApi) => {
      todos = todosFromApi;
      renderTodos();
    });
}

function renderTodos() {
  todoList.innerHTML = "";
  todos.forEach((todo) => {
    const newLi = document.createElement("li");
    const todoDescription = document.createElement("label");
    todoDescription.innerText = todo.description;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = todo.id;
    if (todo.done === true) {
      checkbox.checked = true;
    }

    checkbox.addEventListener("change", () => {
      todo.done = !todo.done;
      const updatedTodo = {
        id: todo.id,
        description: todo.description,
        done: todo.done,
      };
      fetch("http://localhost:4730/todos/" + todo.id, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(updatedTodo),
      }).then((res) => res.json());
    });

    todoDescription.setAttribute("for", checkbox.id);
    newLi.append(todoDescription, checkbox);
    todoList.appendChild(newLi);
  });
}

addTodoBtn.addEventListener("click", () => {
  if (newTodoInput.value === "") {
    return;
  }
  const newTodoText = newTodoInput.value;
  const newTodo = {
    description: newTodoText,
    done: false,
  };
  fetch("http://localhost:4730/todos", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(newTodo),
  })
    .then((res) => res.json())
    .then((newTodoFromApi) => {
      todos.push(newTodoFromApi);
      newTodoInput.value = "";
      renderTodos();
    });
});

removeTodoBtn.addEventListener("click", () => {
  for (let todo of todos) {
    if (todo.done === true) {
      fetch("http://localhost:4730/todos/" + todo.id, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then(() => {
          loadTodos();
        });
    }
  }
});

loadTodos();
