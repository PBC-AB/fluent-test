export async function onRequest(context){

    // Frame check
    if (!/content-builder\..*\.marketingcloudapps.com/.test(document.location.ancestorOrigins[0])){
        //displayUnauthorized("App is not running on valid environment.");
        return new Response('File is not running on valid environment.', {status: 405});
    }

    const { request } = context;

    const validURL = context.env.APP_URL_BUTTON; 

    if(request.method === 'POST'){
        
        const authUrl = context.env.AUTH_ENDPOINT_BUTTON;
        const restUrl = context.env.REST_ENDPOINT_BUTTON;
        const secretId = context.env.WEBAPPCLIENT_SECRET_BUTTON;
        const clientId = context.env.WEBAPP_CLIENTID_BUTTON;

        const data = {
            authEndpoint : authUrl,
            restEndpoint : restUrl,
            webAppClientSecret : secretId,
            webAppClientId : clientId,
        };

        return new Response(JSON.stringify(data), {headers: {'Content-Type' : 'text/plain'}});
        
    }

    return new Response('Method not allowed', {status: 405});
}
