"""
Text preprocessing and sentence/clause splitting utilities for ASAG.
"""

import re
from typing import List


def clean_text(text: str) -> str:
    """Clean and normalize input text."""
    if not text:
        return ""
    # Normalize unicode whitespace and newlines
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    # Collapse consecutive whitespace characters
    text = re.sub(r"[ \t]+", " ", text)
    # Collapse multiple consecutive newlines to double newline
    text = re.sub(r"\n\s*\n+", "\n\n", text)
    return text.strip()


def split_sentences(text: str) -> List[str]:
    """
    Split text into individual sentences and clauses.
    Handles standard punctuation (. ? ! ;), bullet points, and numbered lists.
    """
    cleaned = clean_text(text)
    if not cleaned:
        return []

    # First split on linebreaks or bullet points
    lines = re.split(r"\n+|[•\*\-]\s+|(?:\d+\.\s+)", cleaned)
    sentences: List[str] = []

    for line in lines:
        line_clean = line.strip()
        if not line_clean:
            continue
        # Split line on sentence boundaries (. ? ! ;)
        raw_parts = re.split(r"(?<=[.?!;])\s+", line_clean)
        for part in raw_parts:
            s = part.strip(" \t\n\r.?!;,-")
            if len(s) > 2:
                sentences.append(s)

    if not sentences and cleaned:
        sentences = [cleaned.strip(" \t\n\r.?!;,-")]

    return sentences
