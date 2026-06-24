import { AIMessage } from "langchain";
import { type GraphState } from "../graph.ts";

export function LowerCase(state: GraphState): GraphState {
    const responseText = state.output.toLowerCase()

    return {
        ...state,
        output: responseText,
    }
}