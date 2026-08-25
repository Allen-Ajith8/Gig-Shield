from typing import TypedDict, Annotated, List, Dict, Any
from langgraph.graph import StateGraph, END
import json

# Define the state for our multi-agent workflow
class WorkflowState(TypedDict):
    dataset_path: str
    goal: str
    current_agent: str
    messages: Annotated[List[Dict[str, str]], "add_messages"]
    plan: List[str]
    completed_steps: List[str]
    metadata: Dict[str, Any]

def master_agent(state: WorkflowState):
    """
    The Master Agent understands the goal and dynamically plans which specialized agents are needed.
    """
    print(f"Master Agent analyzing goal: {state['goal']}")
    
    # Dummy logic to generate a plan based on the goal
    plan = ["profiling_agent", "cleaning_agent", "ml_readiness_agent"]
    
    return {
        "plan": plan,
        "current_agent": plan[0] if plan else "end",
        "messages": [{"role": "master", "content": f"Created plan: {', '.join(plan)}"}]
    }

def profiling_agent(state: WorkflowState):
    """Automatic Data Profiling Agent"""
    print("Profiling Agent running...")
    return {
        "completed_steps": ["profiling_agent"],
        "messages": [{"role": "profiling", "content": "Profiled dataset successfully."}]
    }

def cleaning_agent(state: WorkflowState):
    """Cleaning & Imputation Agent"""
    print("Cleaning Agent running...")
    return {
        "completed_steps": ["cleaning_agent"],
        "messages": [{"role": "cleaning", "content": "Cleaned dataset."}]
    }

def ml_readiness_agent(state: WorkflowState):
    """ML Readiness Agent"""
    print("ML Readiness Agent running...")
    return {
        "completed_steps": ["ml_readiness_agent"],
        "messages": [{"role": "ml", "content": "Dataset is ready for ML."}]
    }

def router(state: WorkflowState):
    """Routes to the next agent in the plan."""
    plan = state.get("plan", [])
    completed = state.get("completed_steps", [])
    
    for step in plan:
        if step not in completed:
            return step
    return "end"

# Build the graph
workflow = StateGraph(WorkflowState)

# Add nodes (Agents)
workflow.add_node("master_agent", master_agent)
workflow.add_node("profiling_agent", profiling_agent)
workflow.add_node("cleaning_agent", cleaning_agent)
workflow.add_node("ml_readiness_agent", ml_readiness_agent)

# Set entry point
workflow.set_entry_point("master_agent")

# Add conditional edges from master to specific agents
workflow.add_conditional_edges(
    "master_agent",
    router,
    {
        "profiling_agent": "profiling_agent",
        "cleaning_agent": "cleaning_agent",
        "ml_readiness_agent": "ml_readiness_agent",
        "end": END
    }
)

# After each specialized agent, route to the next step or end
workflow.add_conditional_edges("profiling_agent", router, {"cleaning_agent": "cleaning_agent", "ml_readiness_agent": "ml_readiness_agent", "end": END})
workflow.add_conditional_edges("cleaning_agent", router, {"ml_readiness_agent": "ml_readiness_agent", "end": END})
workflow.add_conditional_edges("ml_readiness_agent", router, {"end": END})

app_graph = workflow.compile()

if __name__ == "__main__":
    initial_state = {
        "dataset_path": "dummy.csv",
        "goal": "Predict customer churn",
        "current_agent": "master",
        "messages": [],
        "plan": [],
        "completed_steps": [],
        "metadata": {}
    }
    
    for s in app_graph.stream(initial_state):
        print(s)
        print("---")
