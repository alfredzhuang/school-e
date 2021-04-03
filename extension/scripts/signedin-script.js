// Classes to be printed in the signed in page
let classes = [];

// Retrieve the classes and create new html elements for them
chrome.runtime.sendMessage({ message: "getclasses" }, function (response) {
  classes = response;
  classes.forEach(function (oneClass) {
    const div = document.createElement("div");
    div.textContent = `${oneClass.className}: ${oneClass.classLink}`;
    const button = document.createElement("button");
    button.textContent = `Delete`;
    button.onclick = function () {
      deleteClass(oneClass.classId);
    };
    div.appendChild(button);
    document.querySelector("#classes").appendChild(div);
  });
});

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

function deleteClass(classId) {
  chrome.runtime.sendMessage(
    { message: "deleteclass", classId: classId },
    function (response) {
      if (response === "success") {
        window.location.href = "../pages/signedin.html";
      }
    }
  );
}
