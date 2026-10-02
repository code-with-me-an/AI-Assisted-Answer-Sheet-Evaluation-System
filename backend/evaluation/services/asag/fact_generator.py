"""
Candidate Reference Fact Generator.

Generates candidate reference facts from a teacher-provided reference answer.
Decomposes answers into atomic, verifiable factual statements that the teacher
can review, edit, delete, reorder, and approve before evaluation.
"""

import re
from typing import List

from .preprocessing import clean_text


def generate_candidate_facts(reference_text: str) -> List[str]:
    """
    Extract candidate reference facts from reference answer text.
    Handles:
    - Numbered lists (1. 2. 3. or 1) 2) or (a) (b))
    - Bullet points (* - •)
    - Sentence boundaries (. ! ?)
    - Semicolon-separated statements
    - Comma-separated long dependent clauses when appropriate
    """
    cleaned = clean_text(reference_text)
    if not cleaned:
        return []

    # If the text has bullet points or numbered lists, split by those first
    has_numbered_or_bullets = bool(re.search(r"(?:^\s*(?:\d+[\.\)]|\([a-zA-Z0-9]+\)|[•\*\-])\s+)|(?:\n\s*(?:\d+[\.\)]|\([a-zA-Z0-9]+\)|[•\*\-])\s+)", cleaned))

    raw_chunks: List[str] = []
    if has_numbered_or_bullets:
        # Split on numbered prefixes or bullets
        splits = re.split(r"(?:^|\n)\s*(?:\d+[\.\)]|\([a-zA-Z0-9]+\)|[•\*\-])\s+", cleaned)
        for chunk in splits:
            chunk = chunk.strip()
            if chunk:
                # Also split sentences inside chunk if long
                sentences = re.split(r"(?<=[.?!])\s+", chunk)
                for sent in sentences:
                    if sent.strip():
                        raw_chunks.append(sent.strip())
    else:
        # Split on line breaks first
        paragraphs = cleaned.split("\n")
        for para in paragraphs:
            para = para.strip()
            if not para:
                continue
            # Split on sentence terminals and semicolons
            sents = re.split(r"(?<=[.?!;])\s+", para)
            for s in sents:
                s = s.strip()
                if s:
                    raw_chunks.append(s)

    candidate_facts: List[str] = []
    for chunk in raw_chunks:
        # Clean leading/trailing punctuation and whitespace
        fact = chunk.strip(" \t\n\r.;,:-")
        # Remove leading bullet remnants if any
        fact = re.sub(r"^(\d+[\.\)]|\([a-zA-Z0-9]+\)|[•\*\-])\s*", "", fact).strip()
        # Filter trivial strings (like single word fragments < 3 chars)
        if len(fact) >= 4:
            # Capitalize first letter if needed
            fact = fact[0].upper() + fact[1:] if len(fact) > 1 else fact.upper()
            if fact not in candidate_facts:
                candidate_facts.append(fact)

    if not candidate_facts and cleaned:
        candidate_facts = [cleaned.strip(" \t\n\r.;,:-")]

    return candidate_facts
