// Add button
document.querySelector("#add").addEventListener("click", function () {
  let email = document.querySelector("#email").value;
  chrome.runtime.sendMessage(
    {
      message: "addemail",
      email: email,
    },
    function (response) {
      if (response === "success") {
        document.querySelector("#email").value = "";
      }
    }
  );
  window.location.href = "../pages/emails.html";
});

// Return button
document.querySelector("#return").addEventListener("click", function () {
  chrome.browserAction.setPopup({ popup: "../pages/signedin.html" });
  window.location.href = "../pages/signedin.html";
});
