document.querySelector("#sign-out").addEventListener("click", function () {
  chrome.runtime.sendMessage({ message: "logout" }, function (response) {
    if (response === "success") {
      window.close();
    }
  });
});

document.querySelector("#addclass").addEventListener("click", function () {
  chrome.browserAction.setPopup({ popup: "../pages/addClass.html" });
  window.location.href = "../pages/addClass.html";
});
