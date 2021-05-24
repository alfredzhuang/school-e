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
    text.className = "email-text";
    // Create link for the class link
    const link = document.createElement("a");
    link.href = oneEmail.email;
    link.onclick = function () {
      chrome.tabs.create({ url: "mailto:" + oneEmail.email });
    };
    link.textContent = `${oneEmail.email} `;
    text.appendChild(link);
    // Add copy to clipboard option
    const copy = document.createElement("button");
    copy.textContent = "Copy text";
    copy.className = "btn btn-secondary btn-sm copy-btn";
    copy.onclick = function () {
      copyText(oneEmail.email);
    };
    text.appendChild(copy);
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

// Function for copy text button
function copyText(email) {
  const temp = document.createElement("textarea");
  temp.textContent = email;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  temp.blur();
  document.body.removeChild(temp);
}
