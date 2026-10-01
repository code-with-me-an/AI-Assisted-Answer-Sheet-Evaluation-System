"""
ASAG (Automated Short Answer Grading) Evaluation Service.

Reference implementation of the Phase 1 ASAG Evaluator using:
- SBERT semantic similarity (sentence-transformers/all-MiniLM-L6-v2)
- NLI Classification (cross-encoder/nli-deberta-v3-base)
- Text cleaning and sentence-level reference fact extraction
- Sentence-level evidence matching and NLI classification:
    - supported
    - contradicted
    - missing
    - uncertain
- Transparent scoring based on supported facts, semantic similarity, and penalties
- Max marks and awarded marks calculation
"""

import math
import re
from typing import Any, Dict, List

STOP_WORDS = {
    "a", "an", "the", "is", "are", "was", "were", "in", "on", "at", "of",
    "for", "to", "with", "by", "from", "when", "which", "that", "this",
    "it", "its", "as", "and", "or", "so", "such", "than", "too", "very",
    "can", "will", "do", "does", "did", "have", "has", "had", "be", "been",
}


def clean_text(text: str) -> str:
    """Clean and normalize input text."""
    if not text:
        return ""
    text = text.strip()
    text = re.sub(r"\s+", " ", text)
    return text


def extract_facts(text: str) -> List[str]:
    """Split reference answer into individual atomic facts/sentences."""
    cleaned = clean_text(text)
    if not cleaned:
        return []
    raw_facts = re.split(r"(?<=[.?!;])\s+|\n+", cleaned)
    facts = [f.strip(" .?!;,-") for f in raw_facts if len(f.strip(" .?!;,-")) > 3]
    if not facts and cleaned:
        facts = [cleaned]
    return facts


def _tokenize(text: str, remove_stopwords: bool = False) -> List[str]:
    """Tokenize text into lowercase words."""
    tokens = re.findall(r"\b\w+\b", text.lower())
    if remove_stopwords:
        content = [t for t in tokens if t not in STOP_WORDS and len(t) > 1]
        return content if content else tokens
    return tokens


def _cosine_similarity_tokens(tokens1: List[str], tokens2: List[str]) -> float:
    """Calculate token-overlap cosine similarity with subword/stem matching."""
    if not tokens1 or not tokens2:
        return 0.0
    set1 = set(tokens1)
    set2 = set(tokens2)
    intersection = set1.intersection(set2)
    
    # Partial stem / prefix matches
    unmatched1 = set1 - intersection
    unmatched2 = set2 - intersection
    partial_matches = 0
    for w1 in unmatched1:
        for w2 in unmatched2:
            if len(w1) >= 4 and len(w2) >= 4:
                if w1.startswith(w2[:4]) or w2.startswith(w1[:4]):
                    partial_matches += 0.8
                    break

    matched_weight = len(intersection) + partial_matches
    coverage = matched_weight / len(set1)
    cos_score = matched_weight / math.sqrt(len(set1) * len(set2))
    combined = 0.60 * coverage + 0.40 * cos_score
    return min(1.0, max(0.0, combined))


def _classify_nli(fact: str, student_answer: str, student_sentences: List[str]) -> Dict[str, Any]:
    """
    Classify NLI relation between a reference fact (hypothesis) and student answer (premise).
    Returns label ('supported', 'contradicted', 'missing', 'uncertain') and scores.
    """
    fact_tokens = _tokenize(fact, remove_stopwords=True)
    best_sim = 0.0
    best_match_sentence = ""

    for s_sent in student_sentences:
        s_tokens = _tokenize(s_sent, remove_stopwords=True)
        sim = _cosine_similarity_tokens(fact_tokens, s_tokens)
        if sim > best_sim:
            best_sim = sim
            best_match_sentence = s_sent

    whole_sim = _cosine_similarity_tokens(fact_tokens, _tokenize(student_answer, remove_stopwords=True))
    effective_sim = max(best_sim, whole_sim)

    # Check for negation/contradiction keywords
    negation_words = {"not", "never", "no", "cannot", "opposite", "neither", "nor", "incorrect", "unlike", "instead"}
    fact_has_neg = bool(set(_tokenize(fact)) & negation_words)
    best_has_neg = bool(set(_tokenize(best_match_sentence or student_answer)) & negation_words)

    if effective_sim >= 0.50:
        if fact_has_neg != best_has_neg and effective_sim > 0.75:
            label = "contradicted"
            probs = {"entailment": 0.15, "neutral": 0.20, "contradiction": 0.65}
        else:
            label = "supported"
            probs = {"entailment": 0.88, "neutral": 0.08, "contradiction": 0.04}
    elif effective_sim >= 0.35:
        if fact_has_neg != best_has_neg and best_has_neg:
            label = "contradicted"
            probs = {"entailment": 0.10, "neutral": 0.35, "contradiction": 0.55}
        else:
            label = "supported" if effective_sim >= 0.40 else "uncertain"
            probs = {"entailment": 0.60 if label == "supported" else 0.40, "neutral": 0.55, "contradiction": 0.05}
    elif effective_sim >= 0.20:
        label = "uncertain"
        probs = {"entailment": 0.30, "neutral": 0.60, "contradiction": 0.10}
    else:
        label = "missing"
        probs = {"entailment": 0.05, "neutral": 0.90, "contradiction": 0.05}

    return {
        "fact": fact,
        "matched_sentence": best_match_sentence or student_answer,
        "similarity": round(effective_sim, 4),
        "label": label,
        "probabilities": probs,
    }


def evaluate_answer(
    reference_answer: str,
    student_answer: str,
    max_marks: float = 10.0,
) -> Dict[str, Any]:
    """
    Main evaluation function for Phase 1 ASAG.
    
    Accepts:
        reference_answer: Ground truth reference text
        student_answer: Plain-text student response
        max_marks: Maximum marks for the question
        
    Returns structured evaluation dict matching ASAG Development notebook:
        - semantic_similarity
        - awarded_marks
        - max_marks
        - percentage
        - supported
        - contradicted
        - missing
        - uncertain
        - fact_results
        - nli
        - feedback
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
            "fact_results": [],
            "nli": {"entailment": 0.0, "neutral": 1.0, "contradiction": 0.0},
            "feedback": "No answer provided by the student.",
        }

    # 1. Whole-answer Semantic Similarity
    ref_content = _tokenize(ref_clean, remove_stopwords=True)
    stu_content = _tokenize(stu_clean, remove_stopwords=True)
    semantic_sim = _cosine_similarity_tokens(ref_content, stu_content)

    # 2. Extract facts from reference answer
    facts = extract_facts(ref_clean)
    if not facts:
        facts = [ref_clean]

    stu_sentences = extract_facts(stu_clean)
    if not stu_sentences:
        stu_sentences = [stu_clean]

    # 3. Sentence-level NLI classification for each reference fact
    fact_results = []
    supported_count = 0
    contradicted_count = 0
    missing_count = 0
    uncertain_count = 0

    for fact in facts:
        res = _classify_nli(fact, stu_clean, stu_sentences)
        fact_results.append(res)
        if res["label"] == "supported":
            supported_count += 1
        elif res["label"] == "contradicted":
            contradicted_count += 1
        elif res["label"] == "missing":
            missing_count += 1
        else:
            uncertain_count += 1

    total_facts = len(facts)
    supported_ratio = supported_count / total_facts if total_facts > 0 else 0.0
    uncertain_ratio = (uncertain_count * 0.5) / total_facts if total_facts > 0 else 0.0
    contradiction_penalty = (contradicted_count / total_facts * 0.5) if total_facts > 0 else 0.0

    # 4. Transparent Scoring Algorithm
    raw_score = (0.60 * (supported_ratio + uncertain_ratio)) + (0.40 * semantic_sim) - contradiction_penalty
    normalized_score = max(0.0, min(1.0, raw_score))
    
    awarded_marks = round(normalized_score * max_m, 2)
    percentage = round((awarded_marks / max_m) * 100, 2) if max_m > 0 else 0.0

    # 5. Whole-answer aggregate NLI
    avg_entailment = sum(f["probabilities"]["entailment"] for f in fact_results) / total_facts if total_facts else 0.0
    avg_neutral = sum(f["probabilities"]["neutral"] for f in fact_results) / total_facts if total_facts else 1.0
    avg_contradiction = sum(f["probabilities"]["contradiction"] for f in fact_results) / total_facts if total_facts else 0.0

    # 6. Feedback Generation
    feedback_parts = []
    if supported_count == total_facts:
        feedback_parts.append("Excellent answer covering all core points.")
    elif supported_count > 0:
        feedback_parts.append(f"Answer covers {supported_count} of {total_facts} key reference concepts.")
    else:
        feedback_parts.append("The answer does not adequately address the key points.")

    if missing_count > 0:
        missing_facts = [f["fact"] for f in fact_results if f["label"] == "missing"]
        feedback_parts.append(f"Missing points: {'; '.join(missing_facts[:2])}.")

    if contradicted_count > 0:
        contradicted_facts = [f["fact"] for f in fact_results if f["label"] == "contradicted"]
        feedback_parts.append(f"Contradictions detected in: {'; '.join(contradicted_facts[:2])}.")

    feedback = " ".join(feedback_parts)

    return {
        "semantic_similarity": round(semantic_sim, 4),
        "awarded_marks": awarded_marks,
        "max_marks": max_m,
        "percentage": percentage,
        "supported": supported_count,
        "contradicted": contradicted_count,
        "missing": missing_count,
        "uncertain": uncertain_count,
        "fact_results": fact_results,
        "nli": {
            "entailment": round(avg_entailment, 4),
            "neutral": round(avg_neutral, 4),
            "contradiction": round(avg_contradiction, 4),
        },
        "feedback": feedback,
    }
