export async function onRequest(context){

    const { request } = context;
    const { authCode, thisAppURL, webAppClientId, webAppClientSecret, authEndpoint, restEndpoint } = await request.json();

    let payload = {
        "grant_type": "authorization_code"
        ,"code": authCode
        ,"client_id": webAppClientId
        ,"client_secret":webAppClientSecret
        ,"redirect_uri": thisAppURL
    }

    try{
        // Retrieve access token
        const response = await fetch(authEndpoint + "v2/token", { method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(payload) 
        })
        const data = await response.json();
        const access_token = data.access_token;

        const org_response = await fetch(restEndpoint + "platform/v1/tokenContext", { headers :{'Authorization': 'Bearer ' + access_token}})
        const org_data = await org_response.json();
        const accountId = org_data.organization.id;

        return new Response(accountId, {headers: {'Content-Type' : 'text/plain'}});
    } catch (e){
        return new Response('Error', {status: 400});
    }
}
