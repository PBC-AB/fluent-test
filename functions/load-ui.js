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

    /*
    // Create a response object
    const responseData = {
        receivedLink: link,
    };
    // Return the response as JSON
     return new Response(JSON.stringify(responseData), {
        headers: { 'Content-Type': 'application/json' },
    });*/
    
    const url = new URL(link + '/ccb-ui.html');
    console.log('toString URL', url.toString())

    // Fetch the modified URL
    const htmlResponse = await fetch(url.toString());

    // Check if the fetch was successful
    if (!htmlResponse.ok) {
        return new Response('Failed to fetch the URL', { status: htmlResponse.status });
    }

    // Get the HTML content as text
    const html = await htmlResponse.text();

    // Return the response
    return new Response(html, {
        headers: { 'Content-Type': 'text/html' },
    });

    /*return new Response(origin); */

}