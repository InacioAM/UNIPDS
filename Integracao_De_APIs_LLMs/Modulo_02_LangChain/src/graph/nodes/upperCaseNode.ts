import { AIMessage } from "langchain";
import { type GraphState } from "../graph.ts";

export function UpperCase(state: GraphState): GraphState {
    const responseText = state.output.toUpperCase()

    return {
        ...state,
        output: responseText,
    }
}