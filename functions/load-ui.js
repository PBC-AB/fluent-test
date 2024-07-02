export async function onRequest(context) {
    
    const { request } = context;

    // Ensure the request method is POST
    if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    // Read the request body as JSON
    let json;
    try {
        json = await request.json();
    } catch (e) {
        return new Response('Invalid JSON', { status: 400 });
    }

    // Extract the link from the JSON payload
    const { link } = json;

    // Check if the link is provided
    if (!link) {
        return new Response('Link not provided', { status: 400 });
    }

    // Create a response object
    const responseData = {
        receivedLink: link,
    };

    // Return the response as JSON
    return new Response(JSON.stringify(responseData), {
        headers: { 'Content-Type': 'application/json' },
    });

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
    });

    return new Response(origin); */

}