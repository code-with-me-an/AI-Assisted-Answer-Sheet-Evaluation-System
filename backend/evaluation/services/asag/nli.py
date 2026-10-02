"""
NLI verification module for ASAG.
Classifies the inferential relationship between student evidence (premise)
and reference facts (hypothesis).
"""

from typing import Any, Dict, List

from .models import compute_nli_probabilities


def verify_facts_nli(
    evidence_matches: List[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    """
    Run NLI classification across all evidence matches.
    """
    verified_results: List[Dict[str, Any]] = []

    for item in evidence_matches:
        fact = item["fact"]
        matched_sentence = item["matched_sentence"]
        similarity = item["similarity"]

        probs, label = compute_nli_probabilities(
            premise=matched_sentence,
            hypothesis=fact,
            similarity_score=similarity,
        )

        verified_results.append({
            "order_index": item.get("order_index", 0),
            "fact": fact,
            "matched_sentence": matched_sentence,
            "similarity": similarity,
            "label": label,
            "probabilities": probs,
        })

    return verified_results
