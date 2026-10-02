"""
ASAG (Automated Short Answer Grading) Pipeline Evaluator.
Orchestrates preprocessing, evidence retrieval, NLI verification, and scoring.
"""

from typing import Any, Dict, List, Optional

from .evidence_matcher import match_facts_to_student_evidence
from .fact_generator import generate_candidate_facts
from .models import compute_semantic_similarity
from .nli import verify_facts_nli
from .preprocessing import clean_text
from .scoring import calculate_evaluation_scores


class ASAGEvaluator:
    """Production ASAG Evaluator engine."""

    @classmethod
    def evaluate(
        cls,
        reference_answer: str,
        student_answer: str,
        reference_facts: Optional[List[str]] = None,
        max_marks: float = 10.0,
    ) -> Dict[str, Any]:
        """
        Evaluate a student response against approved reference facts / reference answer.

        Args:
            reference_answer: Full text of the reference answer.
            student_answer: Full text of the student's submitted response.
            reference_facts: Optional list of approved reference facts. If omitted or empty,
                             candidate facts will be generated from reference_answer.
            max_marks: Maximum marks allocated to the question.

        Returns:
            Dict containing semantic similarity, awarded marks, percentage, fact-level breakdown,
            aggregate NLI probabilities, and constructive feedback.
        """
        ref_clean = clean_text(reference_answer)
        stu_clean = clean_text(student_answer)
        max_m = float(max_marks) if max_marks else 10.0

        if not stu_clean:
            return {
                "semantic_similarity": 0.0,
                "awarded_marks": 0.0,
                "max_marks": max_m,
                "percentage": 0.0,
                "supported": 0,
                "contradicted": 0,
                "missing": 1,
                "uncertain": 0,
                "total_facts": len(reference_facts) if reference_facts else 0,
                "fact_results": [],
                "nli": {"entailment": 0.0, "neutral": 1.0, "contradiction": 0.0},
                "feedback": "No answer provided by the student.",
            }

        # 1. Determine reference facts to evaluate against
        if reference_facts and len(reference_facts) > 0:
            facts = [clean_text(f) for f in reference_facts if clean_text(f)]
        else:
            facts = generate_candidate_facts(ref_clean)

        if not facts and ref_clean:
            facts = [ref_clean]

        # 2. Whole-answer semantic similarity
        whole_sim = compute_semantic_similarity(ref_clean, stu_clean)

        # 3. Match each reference fact against student answer sentences (evidence retrieval)
        evidence_matches = match_facts_to_student_evidence(facts, stu_clean)

        # 4. NLI verification of evidence against facts
        fact_results = verify_facts_nli(evidence_matches)

        # 5. Calculate scores and produce feedback
        return calculate_evaluation_scores(
            fact_results=fact_results,
            whole_similarity=whole_sim,
            max_marks=max_m,
        )


def evaluate_answer(
    reference_answer: str,
    student_answer: str,
    reference_facts: Optional[List[str]] = None,
    max_marks: float = 10.0,
) -> Dict[str, Any]:
    """Convenience functional wrapper for ASAGEvaluator."""
    return ASAGEvaluator.evaluate(
        reference_answer=reference_answer,
        student_answer=student_answer,
        reference_facts=reference_facts,
        max_marks=max_marks,
    )
