import asyncio
from sqlalchemy.orm import Session
from app.orchestration.state_manager import StateManager
from app.models.database import SessionLocal
import logging

logger = logging.getLogger(__name__)

async def run_workflow(workflow_id: str):
    """
    Background task that executes the entire autonomous workflow.
    """
    db: Session = SessionLocal()
    state = StateManager(db, workflow_id)
    
    try:
        state.update_workflow_state("RUNNING")
        await state.broadcast_agent_message("Master Agent", "System", "Workflow orchestration started", "info")
        
        # Phase 1: Planning (Master Agent)
        await state.broadcast_agent_message("Master Agent", "Profiling Agent", "Analyze dataset characteristics", "info")
        
        # Phase 2: Profiling
        from app.agents.profiling_agent import ProfilingAgent
        from app.models.workflow import WorkflowRun
        wf = db.query(WorkflowRun).filter_by(id=workflow_id).first()
        if wf:
            profiler = ProfilingAgent(workflow_id, db)
            
            # Find latest version id for dataset
            from app.models.dataset import DatasetVersion
            latest_version = db.query(DatasetVersion).filter_by(dataset_id=wf.dataset_id).order_by(DatasetVersion.version_number.desc()).first()
            
            if latest_version:
                result = profiler.run({"dataset_id": wf.dataset_id, "version_id": latest_version.id})
                metrics = result["outputs"]["metrics"]
                msg = f"Profiled {metrics['rows']} rows. Found {metrics['missing_pct']}% missing values and {metrics['pii_cols']} PII columns."
                await state.broadcast_agent_message("Profiling Agent", "Master Agent", msg, "success")
                
                # Phase 3: Data Dictionary
                await state.broadcast_agent_message("Master Agent", "Dictionary Agent", "Generate semantic column dictionary.", "info")
                from app.agents.dictionary_agent import DictionaryAgent
                dict_agent = DictionaryAgent(workflow_id, db)
                res = dict_agent.run({"dataset_id": wf.dataset_id, "version_id": latest_version.id})
                cols_proc = res["outputs"]["columns_processed"]
                await state.broadcast_agent_message("Dictionary Agent", "Master Agent", f"Generated dictionary for {cols_proc} columns.", "success")
        
                # Phase 4: Data Quality
                await state.broadcast_agent_message("Master Agent", "Quality Agent", "Analyze data for quality issues.", "info")
                from app.agents.data_quality_agent import DataQualityAgent
                quality_agent = DataQualityAgent(workflow_id, db)
                q_res = quality_agent.run({"dataset_id": wf.dataset_id, "version_id": latest_version.id})
                issues = q_res["outputs"]["quality_issues"]
                await state.broadcast_agent_message("Quality Agent", "Master Agent", f"Found {issues} quality issues. Actions recommended.", "warning" if issues > 0 else "success")
                
                # Phase 5: Privacy
                await state.broadcast_agent_message("Master Agent", "Privacy Agent", "Scan for PII and sensitive data.", "info")
                from app.agents.privacy_agent import PrivacyAgent
                privacy_agent = PrivacyAgent(workflow_id, db)
                p_res = privacy_agent.run({"dataset_id": wf.dataset_id, "version_id": latest_version.id})
                pii_cols = p_res["outputs"]["pii_columns"]
                if pii_cols:
                    await state.broadcast_agent_message("Privacy Agent", "Master Agent", f"Detected PII in {len(pii_cols)} columns.", "critical")
                else:
                    await state.broadcast_agent_message("Privacy Agent", "Master Agent", "No PII detected.", "success")
        
        # Phase 6: Synthetic Data
        await state.broadcast_agent_message("Master Agent", "Synthetic Data Agent", "Evaluating class balance for augmentation.", "info")
        from app.agents.synthetic_data_agent import SyntheticDataAgent
        synth_agent = SyntheticDataAgent(workflow_id, db)
        s_res = synth_agent.run({"dataset_id": wf.dataset_id, "version_id": latest_version.id})
        
        current_version_id = s_res["outputs"]["new_version_id"]
        if s_res["outputs"]["status"] == "completed":
            await state.broadcast_agent_message("Synthetic Data Agent", "Master Agent", f"Generated {s_res['outputs']['generated_records']} synthetic records via SMOTE.", "warning")
        else:
            await state.broadcast_agent_message("Synthetic Data Agent", "Master Agent", "Class balance is adequate. Skipping synthetic generation.", "success")
            
        # Phase 7: Feature Engineering
        await state.broadcast_agent_message("Master Agent", "Feature Engineering Agent", "Generate new predictive features.", "info")
        from app.agents.feature_agent import FeatureEngineeringAgent
        feat_agent = FeatureEngineeringAgent(workflow_id, db)
        f_res = feat_agent.run({"dataset_id": wf.dataset_id, "version_id": current_version_id})
        current_version_id = f_res["outputs"]["new_version_id"]
        if f_res["outputs"]["status"] == "completed":
            await state.broadcast_agent_message("Feature Engineering Agent", "Master Agent", f"Created {len(f_res['outputs']['features_created'])} new features.", "success")
            
        # Phase 8: ML Strategy
        await state.broadcast_agent_message("Master Agent", "ML Strategy Agent", "Determine modeling strategy.", "info")
        from app.agents.ml_strategy_agent import MLStrategyAgent
        ml_strat = MLStrategyAgent(workflow_id, db)
        strat_res = ml_strat.run({"dataset_id": wf.dataset_id, "version_id": current_version_id})
        models_to_test = strat_res["outputs"]["selected_models"]
        await state.broadcast_agent_message("ML Strategy Agent", "Experiment Agent", f"Selected models for evaluation: {', '.join(models_to_test)}", "info")
        
        # Phase 9: Experiment & Training
        from app.agents.experiment_agent import ExperimentAgent
        exp_agent = ExperimentAgent(workflow_id, db)
        exp_res = exp_agent.run({"dataset_id": wf.dataset_id, "version_id": current_version_id, "models": models_to_test})
        results = exp_res["outputs"]["experiments"]
        await state.broadcast_agent_message("Experiment Agent", "Validation Agent", f"Completed training {len(results)} models.", "success")
        
        # Phase 10: Validation
        from app.agents.validation_agent import ValidationAgent
        val_agent = ValidationAgent(workflow_id, db)
        v_res = val_agent.run({"experiments": results})
        best_model = v_res["outputs"]["best_model"]
        best_f1 = v_res["outputs"]["best_metrics"]["f1"]
        await state.broadcast_agent_message("Validation Agent", "Master Agent", f"Selected {best_model} as best model (F1: {best_f1}).", "success")
        
        state.update_workflow_state("COMPLETED")
        await state.broadcast_agent_message("Master Agent", "System", "Autonomous workflow completed successfully.", "success")
        
    except Exception as e:
        logger.error(f"Workflow {workflow_id} failed: {e}")
        state.update_workflow_state("FAILED")
        await state.broadcast_agent_message("Master Agent", "System", f"Workflow failed: {str(e)}", "error")
    finally:
        db.close()
