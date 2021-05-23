// To do list button
document.querySelector("#to-do-list").addEventListener("click", function () {
  chrome.browserAction.setPopup({ popup: "../pages/toDoList.html" });
  window.location.href = "../pages/toDoList.html";
});

// Links button
document.querySelector("#links").addEventListener("click", function () {
  chrome.browserAction.setPopup({ popup: "../pages/links.html" });
  window.location.href = "../pages/links.html";
});

// Sign out button
document.querySelector("#sign-out").addEventListener("click", function () {
  chrome.runtime.sendMessage({ message: "logout" }, function (response) {
    if (response === "success") {
      window.close();
    }
  });
});
