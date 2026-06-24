import { AIMessage } from "langchain";
import { type GraphState } from "../graph.ts";

export function FallbackCase(state: GraphState): GraphState {
    
    const fallbackMessage = "Unknown command. Please use \"upper\" to convert to uppercase or \"lower\" to convert to lowercase.";
    const fallbackAIMessage = new AIMessage(fallbackMessage);

    return {
        ...state,
        output: fallbackMessage,
        messages: [...state.messages, fallbackAIMessage]
    }
}