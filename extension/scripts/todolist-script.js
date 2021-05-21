// tasks to be shown in the to-do list
tasks = [];

// Retrieve the tasks and display them on the page
chrome.runtime.sendMessage({ message: "getTasks" }, function (response) {
  tasks = response;
  tasks.forEach(function (oneTask) {
    // Create div
    const div = document.createElement("div");
    div.className = "task-element";
    // Create paragraph element for each task
    const text = document.createElement("p");
    text.textContent = `${oneTask.taskName}`;
    div.appendChild(text);
    // Create button to delete the task
    const button = document.createElement("button");
    button.className = "delete-button";
    button.textContent = `Delete`;
    button.onclick = function () {
      deleteTask(oneTask.taskId);
    };
    div.appendChild(button);
    document.querySelector("#todolist-tasks").appendChild(div);
  });
});

// Submit button
document.querySelector("#submit").addEventListener("click", function () {
  let taskName = document.querySelector("#taskName").value;
  chrome.runtime.sendMessage(
    {
      message: "addTask",
      taskName: taskName,
    },
    function (response) {
      if (response === "success") {
        document.querySelector("#taskName").value = "";
      }
    }
  );
  window.location.href = "../pages/toDoList.html";
});

// Return button
document.querySelector("#return").addEventListener("click", function () {
  chrome.browserAction.setPopup({ popup: "../pages/signedin.html" });
  window.location.href = "../pages/signedin.html";
});

// Function for the delete button
function deleteTask(taskId) {
  chrome.runtime.sendMessage(
    { message: "deletetask", taskId: taskId },
    function (response) {
      if (response === "success") {
        window.location.href = "../pages/toDoList.html";
      }
    }
  );
}
