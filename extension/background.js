let signed_in = false;
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
                fetch("http://localhost:3000/login", {
                  method: "GET",
                  headers: {
                    Authorization: "Basic " + btoa(`${user_info.sub}`),
                  },
                })
                  .then((res) => {
                    return new Promise((resolve) => {
                      if (res !== 200) resolve("fail");
                      resolve("success");
                    });
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
    chrome.browserAction.setPopup({ popup: "/pages/signin.html" }, function () {
      signed_in = false;
      sendResponse("success");
    });
    return true;
  }
});
