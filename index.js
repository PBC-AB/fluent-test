console.log('index.js start');
import express from 'express';

let app = express();
app.use(express.json()); // establish middleware


const PORT = process.env.PORT || 8080; // Use 8080 as a fallback if PORT is not set

//const thisAppURL = process.env.APP_URL_BUTTON
const authEndpoint = process.env.AUTH_ENDPOINT_BUTTON
const restEndpoint = process.env.REST_ENDPOINT_BUTTON
const webAppClientId = process.env.WEBAPP_CLIENTID_BUTTON
const webAppClientSecret = process.env.WEBAPPCLIENT_SECRET_BUTTON

const authURL = authEndpoint + "v2/token"


app.get('/load-ui', (req, res) => {
    res.sendFile('ccb-ui.html', { root: '.' });
});

// 2nd access
app.post('/submit-authCode', (req, res) => {
    const { authCode, thisAppURL } = req.body;

    // Get AccountID
    authAPICall(authCode, thisAppURL)
        .then(accountId => {
            // console.log('accountId:', accountId);
            // Send a POST request to /authed with the accountId
            res.status(200).json({ accountId });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ error: error.message });
        });
});

function authAPICall(authCode, thisAppURL) {

    let payload = {
      "grant_type": "authorization_code"
      ,"code": authCode
      ,"client_id": webAppClientId
      ,"client_secret":webAppClientSecret
      ,"redirect_uri": thisAppURL
    }
   
    return fetch(authURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
       // Handle the response from the backend
        console.log(data);
        var accessToken = data.access_token
        console.log(accessToken)
        var restUrl = restEndpoint + "platform/v1/tokenContext";
        console.log(restUrl)
        return fetch(restUrl, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });
    })
    .then(response => response.json())
    .then(data => {
        var accountId = data.organization.id;
        //console.log('accountId:', accountId);      
        return accountId; // Return the accountId
    })
    .catch(error => {
      throw new Error('Error making API call');
    });
}

app.get('/credentials', (req, res) => {
    res.status(200).json({
        webAppClientId : webAppClientId,
        authEndpoint : authEndpoint
    });
});

app.use(express.static('.')); // serve static files from the current directory

//initial access
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: '.' });
});

app.listen(PORT, async () => { 
    console.log(`App started on Port ${PORT}`);
});
