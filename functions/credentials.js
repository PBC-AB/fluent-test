export function onRequest(context){
    const envVar = context.env.AUTH_ENDPOINT_BUTTON;
    return new Response(`Environment variable value: ${envVar}`);
}