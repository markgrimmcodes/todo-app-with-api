const addTodoBtn = document.querySelector("#addButton");
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
    const text = document.createTextNode(todo.description);
    newLi.appendChild(text);
    todoList.appendChild(newLi);
  });
}

addTodoBtn.addEventListener("click", () => {
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
      renderTodos();
    });
});

loadTodos();
