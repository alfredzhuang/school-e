// Classes to be printed in the signed in page
let classes = [];

// Retrieve the classes and create new html elements for them
chrome.runtime.sendMessage({ message: "getclasses" }, function (response) {
  classes = response;
  classes.forEach(function (oneClass) {
    // Create div
    const div = document.createElement("div");
    div.className = "class-element";
    // Create paragraph element for class and its link
    const text = document.createElement("p");
    // Create link for the class link
    const link = document.createElement("a");
    link.href = oneClass.classLink;
    link.onclick = function () {
      chrome.tabs.create({ url: oneClass.classLink });
    };
    link.textContent = `${oneClass.classLink}`;
    text.textContent = `${oneClass.className}: `;
    text.appendChild(link);
    div.appendChild(text);
    // Create button to delete the class
    const button = document.createElement("button");
    button.className = "delete-button";
    button.textContent = `Delete`;
    button.onclick = function () {
      deleteClass(oneClass.classId);
    };
    div.appendChild(button);
    document.querySelector("#classes").appendChild(div);
  });
});

// Sign out button
document.querySelector("#sign-out").addEventListener("click", function () {
  chrome.runtime.sendMessage({ message: "logout" }, function (response) {
    if (response === "success") {
      window.close();
    }
  });
});

// Add class button
document.querySelector("#addclass").addEventListener("click", function () {
  chrome.browserAction.setPopup({ popup: "../pages/addClass.html" });
  window.location.href = "../pages/addClass.html";
});

// Function for the delete button
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
