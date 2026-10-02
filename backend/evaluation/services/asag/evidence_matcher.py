"""
Evidence retrieval module for ASAG.
Matches teacher-approved reference facts against student response sentences.
"""

from typing import Any, Dict, List

from .models import compute_semantic_similarity
from .preprocessing import split_sentences


def match_facts_to_student_evidence(
    facts: List[str],
    student_answer: str,
) -> List[Dict[str, Any]]:
    """
    For each reference fact, retrieves the best matching sentence/evidence
    from the student's answer using semantic similarity.
    """
    if not facts:
        return []

    student_sentences = split_sentences(student_answer)
    results: List[Dict[str, Any]] = []

    for idx, fact in enumerate(facts):
        best_sentence = ""
        best_sim = 0.0

        for sent in student_sentences:
            sim = compute_semantic_similarity(fact, sent)
            if sim > best_sim:
                best_sim = sim
                best_sentence = sent

        # Also check against whole student answer if sentences didn't yield high score
        whole_sim = compute_semantic_similarity(fact, student_answer)
        if whole_sim > best_sim:
            effective_sim = whole_sim
            if not best_sentence:
                best_sentence = student_answer.strip()
        else:
            effective_sim = best_sim

        results.append({
            "order_index": idx,
            "fact": fact,
            "matched_sentence": best_sentence if best_sentence else student_answer.strip(),
            "similarity": round(float(effective_sim), 4),
        })

    return results
