let sdk = new window.sfdc.BlockSDK({
  tabs: [/*{
    key : "economist_ccb_button",
    name : "Button (Custom)",
    url : "LINK TO HEROKU"
  }*/]
  ,blockEditorWidth: 400
});

let scripts = ['/scripts/blocksdk.js', '/scripts/script.js'];

let thisAppURL = window.location.origin + '/';
let webAppClientId;
let webAppClientSecret;
let authEndpoint;
let restEndpoint;

async function initialize(){

  console.log('Custom Content Block is being called by: ', window.location.href);
  // Script should only run on base url / origin
  if (thisAppURL != window.location.href) return;

  // And it should only run on a marketing cloud frame
  if (!/content-builder\..*\.marketingcloudapps.com/.test(document.location.ancestorOrigins[0])){
    displayUnauthorized("App is not running on valid environment.");
    return;
  }
  
  const credentials = await getCredentials();
  ({ webAppClientId, webAppClientSecret, authEndpoint, restEndpoint } = credentials);
  //console.log('credentials', credentials);

  const authCode = await getAuthCode();
  //console.log('getAuthCode', getAuthCode);

  try {
    // Retrieving account information with auth code
    const accountId = await getAccountId(authCode, thisAppURL, webAppClientId, webAppClientSecret, authEndpoint, restEndpoint);
    //console.log('accountid', accountId)

    //console.log('thisAppURL', thisAppURL)
    await load_ui(thisAppURL);

  } catch (e){
    throw e; 
  }
  
}

initialize();

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

function displayUnauthorized(text){
  document.querySelector('.container').innerHTML = "Unauthorized: " + text;
}

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

  const payload = { link: window.location.origin + '/ccb-ui.html'};
  const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
  };

  //console.log('payload', payload)

  try {
    const response = await fetch('/load-ui', options);
    const html = await response.text();
    //console.log('Response:', html);

    document.documentElement.innerHTML = html;
    // Script that have been pasted with innerHTML won't run.
    // This code below forces execution
    scripts.forEach(script => {
      let s = document.createElement('script');
      s.src = script;
      s.type = "text/javascript";
      document.querySelector('head').appendChild(s);
    })
  } catch(e){
    displayUnauthorized("Failed loading UI.");
  }

  return;
}

async function getCredentials(){

    let credentials = {};

    const response = await fetch('/credentials', {method:'POST'});
    const responseText = await response.text();
    credentials = JSON.parse(responseText);

    if(!credentials){
      displayUnauthorized('No credentials.');
      throw 'No credentials.'
    }

    return credentials;
}

async function getAuthCode(){

  // Retrieving Auth Code
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

  let authCode = "";
  if(frameURL && frameURL != "about:blank"){
    let url = new URL(frameURL);
    authCode = url.searchParams.get("code");
    //console.log("Authcode", authCode);
  }

  //Terminate iframe 
  authframe.remove();

  if (!authCode) {
    displayUnauthorized("Authorization failed.");
    throw 'Authorization failed.'
  }

  return authCode;
}