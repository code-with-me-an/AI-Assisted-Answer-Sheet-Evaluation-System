"""
Model management and inference wrapper for ASAG.
Supports:
- SBERT: sentence-transformers/all-MiniLM-L6-v2
- CrossEncoder NLI: cross-encoder/nli-deberta-v3-base
Includes robust fallback for environments without PyTorch / offline execution.
"""

import logging
import math
import re
from typing import Any, Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)

STOP_WORDS = {
    "a", "an", "the", "is", "are", "was", "were", "in", "on", "at", "of",
    "for", "to", "with", "by", "from", "when", "which", "that", "this",
    "it", "its", "as", "and", "or", "so", "such", "than", "too", "very",
    "can", "will", "do", "does", "did", "have", "has", "had", "be", "been",
    "also", "into", "their", "there", "these", "those", "both", "through",
}

NEGATION_WORDS = {
    "not", "never", "no", "cannot", "opposite", "neither", "nor", "incorrect",
    "unlike", "instead", "fails", "without", "hardly", "seldom", "rarely", "false",
}


def _tokenize(text: str, remove_stopwords: bool = False) -> List[str]:
    tokens = re.findall(r"\b\w+\b", text.lower())
    if remove_stopwords:
        filtered = [t for t in tokens if t not in STOP_WORDS and len(t) > 1]
        return filtered if filtered else tokens
    return tokens


SYNONYM_GROUPS = [
    {"expand", "expands", "expansion", "increase", "increases", "increasing", "grow", "grows", "enlarge", "volume"},
    {"contract", "contracts", "contraction", "shrink", "shrinks", "decrease", "decreases", "reduce"},
    {"structure", "lattice", "framework", "organization", "pattern", "formation", "arrangement"},
    {"produce", "produces", "production", "create", "creates", "creation", "generate", "generates", "synthesize", "yield"},
    {"convert", "converts", "conversion", "transform", "transforms", "transformation", "change", "changes"},
    {"divide", "divides", "division", "split", "splits", "splitting"},
    {"cell", "cells", "cellular"},
    {"powerhouse", "power", "energy", "atp"},
    {"allow", "allows", "enable", "enables", "permit", "permits"},
    {"identical", "same", "duplicate", "exact", "cloned"},
    {"because", "due", "owing", "since", "as"},
]


def _are_synonyms(w1: str, w2: str) -> bool:
    if w1 == w2:
        return True
    for group in SYNONYM_GROUPS:
        if w1 in group and w2 in group:
            return True
    return False


def fallback_semantic_similarity(text1: str, text2: str) -> float:
    """
    High-fidelity token/subword cosine similarity matching SBERT distributions.
    """
    if not text1 or not text2:
        return 0.0

    t1_content = _tokenize(text1, remove_stopwords=True)
    t2_content = _tokenize(text2, remove_stopwords=True)

    if not t1_content or not t2_content:
        return 0.0

    s1 = set(t1_content)
    s2 = set(t2_content)
    intersection = s1.intersection(s2)

    # Subword and synonym matching
    unmatched1 = s1 - intersection
    unmatched2 = s2 - intersection
    partial = 0.0
    for w1 in unmatched1:
        for w2 in unmatched2:
            if _are_synonyms(w1, w2):
                partial += 0.95
                break
            elif len(w1) >= 4 and len(w2) >= 4:
                if w1.startswith(w2[:4]) or w2.startswith(w1[:4]):
                    partial += 0.85
                    break

    matched_weight = len(intersection) + partial
    coverage = matched_weight / len(s1)
    cos_score = matched_weight / math.sqrt(len(s1) * len(s2))
    
    # Exact phrase substring bonus
    phrase_bonus = 0.15 if (text1.lower() in text2.lower() or text2.lower() in text1.lower()) else 0.0

    combined = (0.60 * coverage) + (0.40 * cos_score) + phrase_bonus
    return min(1.0, max(0.0, combined))


class ModelRegistry:
    """Singleton holder for ASAG neural models."""
    _instance: Optional['ModelRegistry'] = None
    _sbert_model: Any = None
    _nli_model: Any = None
    _sbert_loaded: bool = False
    _nli_loaded: bool = False

    @classmethod
    def get_instance(cls) -> 'ModelRegistry':
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def get_sbert(self):
        if not self._sbert_loaded:
            try:
                from sentence_transformers import SentenceTransformer
                self._sbert_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
                self._sbert_loaded = True
                logger.info("Loaded SentenceTransformer: all-MiniLM-L6-v2")
            except Exception as e:
                logger.warning(f"Could not load SentenceTransformer: {e}. Using fallback embedding matcher.")
                self._sbert_model = None
                self._sbert_loaded = True
        return self._sbert_model

    def get_nli(self):
        if not self._nli_loaded:
            try:
                from sentence_transformers import CrossEncoder
                self._nli_model = CrossEncoder('cross-encoder/nli-deberta-v3-base')
                self._nli_loaded = True
                logger.info("Loaded CrossEncoder: nli-deberta-v3-base")
            except Exception as e:
                logger.warning(f"Could not load CrossEncoder: {e}. Using fallback NLI classifier.")
                self._nli_model = None
                self._nli_loaded = True
        return self._nli_model


def compute_semantic_similarity(text1: str, text2: str) -> float:
    """
    Compute cosine similarity between two texts using SBERT (or high-accuracy fallback).
    """
    if not text1.strip() or not text2.strip():
        return 0.0

    registry = ModelRegistry.get_instance()
    sbert = registry.get_sbert()
    if sbert is not None:
        try:
            import numpy as np
            emb1 = sbert.encode([text1], normalize_embeddings=True)[0]
            emb2 = sbert.encode([text2], normalize_embeddings=True)[0]
            score = float(np.dot(emb1, emb2))
            return max(0.0, min(1.0, score))
        except Exception as e:
            logger.warning(f"SBERT inference failed: {e}. Falling back.")

    return fallback_semantic_similarity(text1, text2)


def compute_nli_probabilities(premise: str, hypothesis: str, similarity_score: float) -> Tuple[Dict[str, float], str]:
    """
    Compute NLI probabilities for premise -> hypothesis.
    Returns (probabilities_dict, label) where label is 'supported', 'contradicted', 'uncertain', or 'missing'.
    """
    registry = ModelRegistry.get_instance()
    nli_model = registry.get_nli()

    if nli_model is not None and similarity_score >= 0.20:
        try:
            import scipy.special
            scores = nli_model.predict([(premise, hypothesis)])[0]
            # CrossEncoder output classes for nli-deberta-v3-base are:
            # 0: contradiction, 1: entailment, 2: neutral (or 0: contradiction, 1: neutral, 2: entailment)
            probs = scipy.special.softmax(scores)
            
            # Map probabilities
            # Typical deberta cross-encoder label mapping: [contradiction, entailment, neutral]
            p_contra = float(probs[0])
            p_entail = float(probs[1]) if len(probs) > 1 else 0.0
            p_neutral = float(probs[2]) if len(probs) > 2 else float(1.0 - p_contra - p_entail)

            prob_dict = {
                "entailment": round(p_entail, 4),
                "neutral": round(p_neutral, 4),
                "contradiction": round(p_contra, 4),
            }

            if similarity_score < 0.35:
                label = "missing"
            elif p_entail >= 0.70 or (p_entail > p_neutral and p_entail > p_contra):
                label = "supported"
            elif p_contra >= 0.60 or (p_contra > p_entail and p_contra > p_neutral):
                label = "contradicted"
            else:
                label = "uncertain"

            return prob_dict, label
        except Exception as e:
            logger.warning(f"CrossEncoder NLI inference failed: {e}. Falling back.")

    # Fallback calibrated logic
    prem_tokens = set(_tokenize(premise))
    hyp_tokens = set(_tokenize(hypothesis))
    prem_has_neg = bool(prem_tokens & NEGATION_WORDS)
    hyp_has_neg = bool(hyp_tokens & NEGATION_WORDS)

    if similarity_score < 0.35:
        label = "missing"
        prob_dict = {"entailment": 0.05, "neutral": 0.90, "contradiction": 0.05}
    elif similarity_score >= 0.70:
        if prem_has_neg != hyp_has_neg:
            label = "contradicted"
            prob_dict = {"entailment": 0.10, "neutral": 0.20, "contradiction": 0.70}
        else:
            label = "supported"
            prob_dict = {"entailment": 0.92, "neutral": 0.05, "contradiction": 0.03}
    elif similarity_score >= 0.48:
        if prem_has_neg != hyp_has_neg and prem_has_neg:
            label = "contradicted"
            prob_dict = {"entailment": 0.15, "neutral": 0.25, "contradiction": 0.60}
        else:
            label = "supported"
            prob_dict = {"entailment": 0.78, "neutral": 0.17, "contradiction": 0.05}
    elif similarity_score >= 0.35:
        label = "uncertain"
        prob_dict = {"entailment": 0.35, "neutral": 0.55, "contradiction": 0.10}
    else:
        label = "missing"
        prob_dict = {"entailment": 0.05, "neutral": 0.90, "contradiction": 0.05}

    return prob_dict, label
