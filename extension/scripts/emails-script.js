// emails to be shown on the page
emails = [];

// Retrieve the emails and display them on the page
chrome.runtime.sendMessage({ message: "getemails" }, function (response) {
  emails = response;
  emails.forEach(function (oneEmail) {
    // Create div
    const div = document.createElement("div");
    div.className = "email-element";
    // Create paragraph element for each email
    const text = document.createElement("p");
    text.textContent = `${oneEmail.email}`;
    div.appendChild(text);
    // Create button to delete the email
    const button = document.createElement("button");
    button.className = "delete-button btn btn-danger btn-sm";
    button.textContent = `Delete`;
    button.onclick = function () {
      deleteEmail(oneEmail.emailId);
    };
    div.appendChild(button);
    document.querySelector("#emails").appendChild(div);
  });
});

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

// Function for the delete button
function deleteEmail(emailId) {
  chrome.runtime.sendMessage(
    { message: "deleteemail", emailId: emailId },
    function (response) {
      if (response === "success") {
        window.location.href = "../pages/emails.html";
      }
    }
  );
}
