export async function onRequest(context){;

    const { request } = context;
    const { authCode, thisAppURL, webAppClientId, webAppClientSecret } = await request.json();

    let payload = {
        "grant_type": "authorization_code"
        ,"code": authCode
        ,"client_id": webAppClientId
        ,"client_secret":webAppClientSecret
        ,"redirect_uri": thisAppURL
    }

    const response = await fetch(authURL, { method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(payload) 
    })

    try{
        const data = await response.json();
        const access_token = data.access_token;
        const restURL = restEndpoint + "platform/v1/tokenContext"; // TODO
        const org_response = await fetch(restURL, { headers :{'Authorization': 'Bearer ' + access_token}})
        const org_data = await org_response.json();
        const accountId = org_data.organization.id;
        return new Response(accountId, {headers: {'Content-Type' : 'text/plain'}});
    } catch (e){
        console.log(e);
    }
    
}
