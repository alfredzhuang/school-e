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
});

// Return button
document.querySelector("#return").addEventListener("click", function () {
  chrome.browserAction.setPopup({ popup: "../pages/signedin.html" });
  window.location.href = "../pages/signedin.html";
});
