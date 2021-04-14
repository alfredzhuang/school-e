// Import current link anchor tag
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  document.querySelector("#import-link").href = tabs[0].url;
});
document.querySelector("#import-link").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    document.querySelector("#classLink").value = tabs[0].url;
  });
});

// Return button
document.querySelector("#return").addEventListener("click", function () {
  chrome.browserAction.setPopup({ popup: "../pages/signedin.html" });
  window.location.href = "../pages/signedin.html";
});

// Submit button
document.querySelector("#submit").addEventListener("click", function () {
  let className = document.querySelector("#className").value;
  let classLink = document.querySelector("#classLink").value;
  let classPassword = document.querySelector("#classPassword").value;
  chrome.runtime.sendMessage(
    {
      message: "addclass",
      className: className,
      classLink: classLink,
      classPassword: classPassword,
    },
    function (response) {
      if (response === "success") {
        document.querySelector("#className").value = "";
        document.querySelector("#classLink").value = "";
        document.querySelector("#classPassword").value = "";
      }
    }
  );
});
