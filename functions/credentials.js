export function onRequest(context) {
    return new Response(json({
        webAppClientId: 'Test funcion 1',
        authEndpoint : 'Test function 2'
    }))
}