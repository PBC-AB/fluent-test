export default {
    async fetch(request, env, ctx){
        return new Response(`Environment variable value: ${env.AUTH_ENDPOINT_BUTTON}`)
    }
}