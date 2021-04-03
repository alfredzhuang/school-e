// Return button
document.querySelector("#return").addEventListener("click", function () {
  chrome.browserAction.setPopup({ popup: "../pages/signedin.html" });
  window.location.href = "../pages/signedin.html";
});

// Submit button
document.querySelector("#submit").addEventListener("click", function () {
  let className = document.querySelector("#className").value;
  let classLink = document.querySelector("#classLink").value;
  chrome.runtime.sendMessage(
    { message: "addclass", className: className, classLink: classLink },
    function (response) {
      if (response === "success") {
        document.querySelector("#className").value = "";
        document.querySelector("#classLink").value = "";
      }
    }
  );
});
