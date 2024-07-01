let sdk = new window.sfdc.BlockSDK({
  tabs: [/*{
    key : "economist_ccb_button",
    name : "Button (Custom)",
    url : "LINK TO HEROKU"
  }*/]
  ,blockEditorWidth: 400
});

let scripts = ['/scripts/blocksdk.js', '/scripts/script.js'];

async function initialize(){

  let thisAppURL = window.location.origin + '/';
  let webAppClientId;
  let authEndpoint;

  try {
    const response = await fetch('/credentials', {method:'POST'});
    const credentials = await response.json();

    //webAppClientId = credentials.webAppClientId;
    //authEndpoint = credentials.authEndpoint;

    console.log('credentials',credentials);
    return;
  } catch(e){
    console.log(e);
    displayUnauthorized('No credentials.');
    return;
  }
  
  // This script should only run on main frame
  if (window.location.href == thisAppURL && /content-builder\..*\.marketingcloudapps.com/.test(document.location.ancestorOrigins[0])){

    //console.log(window.location.href)
    sdk.triggerAuth2({authURL: authEndpoint, clientId: webAppClientId, redirectURL: thisAppURL});
  
    // Wait for iframe + widget itself to load before progressing
    // Identifies and gets the authcode from the iframe url created by sdk.triggerAuth2
    let authframe = document.querySelector(".authframe");
    let frameURL = "";

    let waited_milliseconds = 0;
    const MAX_WAIT_MILLISECONDS = 2000;
    while(waited_milliseconds < MAX_WAIT_MILLISECONDS){
      frameURL = authframe.contentWindow.location.href;
      if(frameURL == "" || frameURL == "about:blank" ){
        waited_milliseconds += 100;
        await sleep(100);
      } else {
        break;
      }
    }

    //console.log(waited_milliseconds);

    //frameURL = authframe.contentWindow.location.href;
    //console.log("frameURL", frameURL)

    let authCode = "";
    if(frameURL && frameURL != "about:blank"){
      let url = new URL(frameURL);
      authCode = url.searchParams.get("code");
      //console.log("Authcode", authCode);
    }

    //Terminate iframe 
    authframe.remove();

    if (authCode) {
      try {
        // Get AccountID
        fetch('/submit-authCode', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ authCode: authCode, thisAppURL : thisAppURL })
        })
        .then(response => {
          if (response.ok) {
              return response.text(); 
          } else {
              throw new Error('Error: ' + response.status + ' - ' + response.statusText);
          }
        }).then(mid => {
          // AUTH IS OK -> LOAD UI
          load_ui();

          // DO SOMETHING WITH MID
        })
        .catch(error => {
          console.error('Error:', error);
        });
      } catch (error) {
        throw error; 
      }
    }
  } else {
    displayUnauthorized("App is not running on valid environment.");
  }
}

initialize();

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

function displayUnauthorized(text){
  document.querySelector('.container').innerHTML = "Unauthorized: " + text;
}

function load_ui(){
  fetch('load-ui')
    .then(response => response.text())
    .then(html => {
      document.documentElement.innerHTML = html
      // Script that have been pasted with innerHTML won't run.
      // This code below forces execution
      scripts.forEach(script => {
        let s = document.createElement('script');
        s.src = script;
        s.type = "text/javascript";
        document.querySelector('head').appendChild(s);
      })
    })
    .catch(error => displayUnauthorized("Failed loading UI."));
}
