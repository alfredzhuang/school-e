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
    text.textContent = `${oneClass.className}: `;
    // Create link for the class link
    const link = document.createElement("a");
    link.href = oneClass.classLink;
    link.onclick = function () {
      chrome.tabs.create({ url: oneClass.classLink });
    };
    link.textContent = `${oneClass.classLink}`;
    text.appendChild(link);
    // Create paragraph element for password if there is one
    if (oneClass.classPassword !== "") {
      const password = document.createElement("p");
      password.textContent = `Password: ${oneClass.classPassword} `;
      // Add copy to clipboard option
      const copy = document.createElement("button");
      copy.textContent = "Copy text";
      copy.className = "copy-button";
      copy.onclick = function () {
        copyText(oneClass.classPassword);
      };
      password.appendChild(copy);
      text.appendChild(password);
    }
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

// Add class button
document.querySelector("#addclass").addEventListener("click", function () {
  chrome.browserAction.setPopup({ popup: "../pages/addClass.html" });
  window.location.href = "../pages/addClass.html";
});

// Return button
document.querySelector("#return").addEventListener("click", function () {
  chrome.browserAction.setPopup({ popup: "../pages/signedin.html" });
  window.location.href = "../pages/signedin.html";
});

// Function for the delete button
function deleteClass(classId) {
  chrome.runtime.sendMessage(
    { message: "deleteclass", classId: classId },
    function (response) {
      if (response === "success") {
        window.location.href = "../pages/links.html";
      }
    }
  );
}

// Function for copy text button
function copyText(classPassword) {
  const temp = document.createElement("textarea");
  temp.textContent = classPassword;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  temp.blur();
  document.body.removeChild(temp);
}
