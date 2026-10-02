"""
ASAG (Automated Short Answer Grading) Service Facade.
Maintains backward compatibility with imports from backend/evaluation/services/asag_evaluator.py.
"""

from .asag import ASAGEvaluator, clean_text, evaluate_answer, generate_candidate_facts, split_sentences

extract_facts = generate_candidate_facts

__all__ = [
    'ASAGEvaluator',
    'evaluate_answer',
    'extract_facts',
    'generate_candidate_facts',
    'clean_text',
    'split_sentences',
]
