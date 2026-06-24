import { OutputFunctionsParser } from "@langchain/core/output_parsers/openai_functions";
import { END, MessagesZodMeta, START, StateGraph,} from "@langchain/langgraph";
import { withLangGraph } from "@langchain/langgraph/zod";
import { BaseMessage } from "langchain";
import { z } from 'zod/v3';
import { identifyIntent } from "./nodes/identifyIntentNode.ts";
import { chatResponse } from "./nodes/chatResponseNode.ts";
import { UpperCase } from "./nodes/upperCaseNode.ts";
import { LowerCase } from "./nodes/lowerCaseNode.ts";
import { FallbackCase } from "./nodes/fallbackCaseNode.ts";

const GraphState = z.object({
    messages: withLangGraph(
        z.custom<BaseMessage[]>(),
        MessagesZodMeta
    ),
    output: z.string(),
    command: z.enum(['uppercase', 'lowercase', 'unknown']),
})

export type GraphState = z.infer<typeof GraphState>

export function createGraph() {
    const workflow = new StateGraph({
        stateSchema: GraphState
    })

    .addNode("IdentifyIntent", identifyIntent)
    .addNode("ChatResponse", chatResponse)
    .addNode("UpperCase", UpperCase)
    .addNode("LowerCase", LowerCase)
    .addNode("FallbackCase", FallbackCase)


/* 
   .addNode("IdentifyIntent", (state: GraphState ) => {
        return {
             ...state,
             output: "teste",
        }
    })
*/

    .addEdge(START, "IdentifyIntent")
    .addConditionalEdges(
        "IdentifyIntent", 
        (state: GraphState) => {
            switch(state.command) {
                case 'uppercase':
                    return 'UpperCase';
                case 'lowercase':
                    return 'LowerCase';
                default:
                    return 'fallback'
            }
        },
        {
            'UpperCase': 'UpperCase',
            'LowerCase': 'LowerCase',
            'fallback': 'FallbackCase'
        }  
    )
    .addEdge("LowerCase", "ChatResponse")
    .addEdge("UpperCase", "ChatResponse")
    .addEdge("FallbackCase", "ChatResponse")
    .addEdge("ChatResponse", END)

    return workflow.compile()
}