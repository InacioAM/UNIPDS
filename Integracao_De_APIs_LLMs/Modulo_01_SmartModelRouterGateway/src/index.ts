import { createServer } from "./server.ts";
import { config } from "./config.ts";
import { OpenRouterService } from "./openrouterServices.ts";    

const routerService = new OpenRouterService(config) 
const app = createServer(routerService)

await app.listen({ port: config.port, host: '0.0.0.0'})
app.inject({
    method: 'POST',
    url: '/chat',   
    body: { question: 'this is a test question' }
}).then(response => {
    console.log('Response status:', response.statusCode);
    console.log('Response body:', response.body);
})