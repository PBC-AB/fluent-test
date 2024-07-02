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

  console.log('Is being called', window.location.href)

  let thisAppURL = window.location.origin + '/';

  let webAppClientId;
  let webAppClientSecret;
  let authEndpoint;
  let restEndpoint;

  if (thisAppURL != window.location.href) return;

  try {
    const response = await fetch('/credentials', {method:'POST'});
    if(!response.ok) return;
    const responseText = await response.text();
    const credentials = JSON.parse(responseText);

    if(!credentials) return;

    webAppClientId = credentials.webAppClientId;
    webAppClientSecret = credentials.webAppClientSecret;
    authEndpoint = credentials.authEndpoint;
    restEndpoint = credentials.restEndpoint;

    console.log('credentials', credentials);
    
  } catch(e){
    console.log(e);
    displayUnauthorized('No credentials.');
    return;
  }
  
  // This script should only run on main frame
  if (/content-builder\..*\.marketingcloudapps.com/.test(document.location.ancestorOrigins[0])){
  //if (window.location.href == thisAppURL){

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

    console.log(waited_milliseconds);

    //frameURL = authframe.contentWindow.location.href;
    //console.log("frameURL", frameURL)

    let authCode = "";
    if(frameURL && frameURL != "about:blank"){
      let url = new URL(frameURL);
      authCode = url.searchParams.get("code");
      console.log("Authcode", authCode);
    }

    //Terminate iframe 
    authframe.remove();

    if (!authCode) {
      displayUnauthorized("App is not running on valid environment.");
      return;
    }

    try {

      const accountId = await getAccountId(authCode, thisAppURL, webAppClientId, webAppClientSecret, authEndpoint, restEndpoint);
      console.log('accountid', accountId)

      console.log('thisAppURL', thisAppURL)
      let newPage = await load_ui(thisAppURL);
      console.log('newPage', newPage)

    } catch (e){
      throw e; 
    }
    
  }
  
}

initialize();

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

function displayUnauthorized(text){
  document.querySelector('.container').innerHTML = "Unauthorized: " + text;
}

// Needs auth code to do so
async function getAccountId(authCode, thisAppURL, webAppClientId, webAppClientSecret, authEndpoint, restEndpoint) {

  const payload = { 
    authCode: authCode, 
    thisAppURL : thisAppURL, 
    webAppClientId : webAppClientId, 
    webAppClientSecret : webAppClientSecret, 
    authEndpoint : authEndpoint,
    restEndpoint : restEndpoint 
  }

  const options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  }

  return fetch('/submit-auth', options)
    .then( response => {
      if (response.ok) {
        return response.text(); 
      } else {
        throw new Error('Error: ' + response.status + ' - ' + response.statusText);
      }
    })
    .then(mid => {
      return mid;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

async function load_ui(thisAppURL){

  const payload = { url : thisAppURL }

  const options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  }

  return fetch('load-ui', options)
    .then(response => response.json())
    .then(html => {
      return html
      /*document.documentElement.innerHTML = html
      // Script that have been pasted with innerHTML won't run.
      // This code below forces execution
      scripts.forEach(script => {
        let s = document.createElement('script');
        s.src = script;
        s.type = "text/javascript";
        document.querySelector('head').appendChild(s);
      })*/
    })
    .catch(error => displayUnauthorized("Failed loading UI."));
}