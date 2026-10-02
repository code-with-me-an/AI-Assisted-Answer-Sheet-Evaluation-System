"""
ASAG (Automated Short Answer Grading) Service Package.
Hybrid Reference Fact & SBERT + NLI Evaluation Engine.
"""

from .evaluator import ASAGEvaluator, evaluate_answer
from .fact_generator import generate_candidate_facts
from .preprocessing import clean_text, split_sentences

__all__ = [
    'ASAGEvaluator',
    'evaluate_answer',
    'generate_candidate_facts',
    'clean_text',
    'split_sentences',
]
