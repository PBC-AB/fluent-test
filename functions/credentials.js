export function onRequest(context){;
    return new Response(`Environment variable value: ${context}`);
}