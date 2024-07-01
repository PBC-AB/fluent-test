import { Router } from 'itty-router'

const router = Router();

const authEndpoint = env.AUTH_ENDPOINT_BUTTON || process.env.AUTH_ENDPOINT_BUTTON

router.get('/credentials', () => {
    return new Response('test: ' + authEndpoint, {status: 200})
});

addEventListener('fetch', (event) => {
    event.respondWith(router.handle(event.request))
});
