import Fastify from "fastify";
import { createGraph } from "./graph/graph.ts";
import { HumanMessage } from "langchain";

const graph = createGraph()

export const createServer = ( ) => {
    const app = Fastify({logger: false})

    app.post('/chat', {
        schema:{
            body: {
                type: 'object',
                required: ['question'],
                properties:{
                    question: {
                        type: 'string',
                        minLength: 5
                    }

                }
            }
        }
    }, async (request, reply) => {
        try{
            const { question } = request.body as { question: string }
            const response = await graph.invoke({
                messages: [new HumanMessage(question)]   
            })

            return reply.send(response.output)
        } catch (error) {
            console.error('Error processing request:', error)
            return reply.status(500).send('Internal Server Error')
        }
    })
    return app
}