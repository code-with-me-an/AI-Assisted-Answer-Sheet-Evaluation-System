"""
Scoring and feedback generation for ASAG.
"""

from typing import Any, Dict, List


def calculate_evaluation_scores(
    fact_results: List[Dict[str, Any]],
    whole_similarity: float,
    max_marks: float = 10.0,
) -> Dict[str, Any]:
    """
    Compute marks, percentages, summary counts, and constructive feedback
    from fact verification results and whole-answer semantic similarity.
    """
    max_m = float(max_marks) if max_marks else 10.0
    total_facts = len(fact_results)

    if total_facts == 0:
        return {
            "semantic_similarity": round(whole_similarity, 4),
            "awarded_marks": 0.0,
            "max_marks": max_m,
            "percentage": 0.0,
            "supported": 0,
            "contradicted": 0,
            "missing": 0,
            "uncertain": 0,
            "total_facts": 0,
            "fact_results": [],
            "nli": {"entailment": 0.0, "neutral": 1.0, "contradiction": 0.0},
            "feedback": "No reference facts configured for evaluation.",
        }

    supported_count = sum(1 for f in fact_results if f["label"] == "supported")
    contradicted_count = sum(1 for f in fact_results if f["label"] == "contradicted")
    missing_count = sum(1 for f in fact_results if f["label"] == "missing")
    uncertain_count = sum(1 for f in fact_results if f["label"] == "uncertain")

    supported_ratio = supported_count / total_facts
    uncertain_ratio = (uncertain_count * 0.5) / total_facts
    contradiction_penalty = (contradicted_count / total_facts) * 0.5

    raw_score = (0.60 * (supported_ratio + uncertain_ratio)) + (0.40 * whole_similarity) - contradiction_penalty
    normalized_score = max(0.0, min(1.0, raw_score))

    awarded_marks = round(normalized_score * max_m, 2)
    percentage = round((awarded_marks / max_m) * 100, 2) if max_m > 0 else 0.0

    # Aggregate whole-answer NLI probabilities
    avg_entailment = sum(f["probabilities"]["entailment"] for f in fact_results) / total_facts
    avg_neutral = sum(f["probabilities"]["neutral"] for f in fact_results) / total_facts
    avg_contradiction = sum(f["probabilities"]["contradiction"] for f in fact_results) / total_facts

    # Build constructive, human-readable feedback
    feedback_parts: List[str] = []
    if supported_count == total_facts:
        feedback_parts.append(f"Excellent answer covering all {total_facts} key concepts.")
    elif supported_count > 0:
        feedback_parts.append(f"Answer correctly addresses {supported_count} of {total_facts} key reference points.")
    else:
        feedback_parts.append("The answer does not adequately cover the required reference concepts.")

    if uncertain_count > 0:
        uncertain_facts = [f["fact"] for f in fact_results if f["label"] == "uncertain"]
        feedback_parts.append(f"Partially covered points: {'; '.join(uncertain_facts[:2])}.")

    if missing_count > 0:
        missing_facts = [f["fact"] for f in fact_results if f["label"] == "missing"]
        feedback_parts.append(f"Missing points: {'; '.join(missing_facts[:2])}.")

    if contradicted_count > 0:
        contradicted_facts = [f["fact"] for f in fact_results if f["label"] == "contradicted"]
        feedback_parts.append(f"Contradictions detected in: {'; '.join(contradicted_facts[:2])}.")

    feedback = " ".join(feedback_parts)

    return {
        "semantic_similarity": round(whole_similarity, 4),
        "awarded_marks": awarded_marks,
        "max_marks": max_m,
        "percentage": percentage,
        "supported": supported_count,
        "contradicted": contradicted_count,
        "missing": missing_count,
        "uncertain": uncertain_count,
        "total_facts": total_facts,
        "fact_results": fact_results,
        "nli": {
            "entailment": round(avg_entailment, 4),
            "neutral": round(avg_neutral, 4),
            "contradiction": round(avg_contradiction, 4),
        },
        "feedback": feedback,
    }
