export async function onRequest(context) {
    
    const { request } = context;
    /*const url = new URL(await request.url);

    // Check if the request is for the root URL or index.html
    if (url.pathname === '/' || url.pathname === '/index.html') {
        // Modify the URL to point to index2.html
        url.pathname = '/ccb-ui.html';
    }

    // Fetch the modified URL
    const response = await fetch(url.toString());

    // Return the response
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
    });*/

    return new Response(JSON.stringify(request));

}