let signed_in = false;
let userid = "";

const CLIENT_ID = encodeURIComponent("");
const RESPONSE_TYPE = encodeURIComponent("id_token");
const REDIRECT_URI = encodeURIComponent("");
const STATE = encodeURIComponent("jasdwiqa");
const SCOPE = encodeURIComponent("openid");
const PROMPT = encodeURIComponent("consent");

function create_oauth2_url() {
  let nonce = encodeURIComponent(
    Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
  );
  let url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URI}&state=${STATE}&scope=${SCOPE}&prompt=${PROMPT}&nonce=${nonce}`;
  return url;
}

function is_signed_in() {
  return signed_in;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "login") {
    if (is_signed_in()) {
      // User is already logged in
      console.log("Already logged in");
    } else {
      // Log user in
      chrome.identity.launchWebAuthFlow(
        {
          url: create_oauth2_url(),
          interactive: true,
        },
        function (redirect_url) {
          let id_token = redirect_url.substring(
            redirect_url.indexOf("id_token") + 9
          );
          const user_info = KJUR.jws.JWS.readSafeJSONString(
            b64utoutf8(id_token.split(".")[1])
          );
          console.log(user_info.sub);
          if (
            (user_info.iss === "https://accounts.google.com" ||
              user_signed_in.iss === "accounts.google.com") &&
            user_info.aud === CLIENT_ID
          ) {
            // Change popup
            chrome.browserAction.setPopup(
              { popup: "/pages/signedin.html" },
              function () {
                signed_in = true;
                userid = user_info.sub;
                // Add to database
                fetch("http://localhost:3000/login", {
                  method: "GET",
                  headers: {
                    Authorization: "Basic " + btoa(`${user_info.sub}`),
                  },
                })
                  .then((res) => {
                    if (res.status !== 200)
                      console.log("user was not added to database");
                  })
                  .catch((err) => console.log(err));
                sendResponse("success");
              }
            );
          } else {
            console.log("Could not log in");
          }
        }
      );
      return true;
    }
  } else if (request.message === "logout") {
    // Log the user out
    chrome.browserAction.setPopup({ popup: "/pages/signin.html" }, function () {
      signed_in = false;
      userid = "";
      sendResponse("success");
    });
    return true;
  } else if (request.message === "addclass") {
    // Add the class to database
    fetch("http://localhost:3000/addclass", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        classLink: request.classLink,
        className: request.className,
        userid: userid,
      }),
    })
      .then((res) => {
        if (res.status !== 200) console.log("class was not added");
      })
      .catch((err) => console.log(err));
    sendResponse("success");
  } else if (request.message === "getclasses") {
    // Retrieve the classes of the user
    fetch("http://localhost:3000/getclasses", {
      method: "GET",
      headers: {
        Authorization: "Basic " + btoa(`${userid}`),
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        sendResponse(json);
      })
      .catch((err) => console.log(err));
    return true;
  }
});
