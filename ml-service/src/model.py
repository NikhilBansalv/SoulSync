# ml-service/src/model.py

from math import sqrt
from typing import List, Dict


def jaccard(list1: List[str], list2: List[str]) -> float:
    """Jaccard similarity between two lists of strings."""
    set1, set2 = set(list1), set(list2)
    if not set1 and not set2:
        return 1.0
    union = set1 | set2
    intersection = set1 & set2
    return len(intersection) / len(union)


def score_profiles(v1: Dict[str, float], v2: Dict[str, float]) -> float:
    """
    Compute a blended compatibility score:
      - Euclidean distance on numeric features (traits, age_dist, smoking, drinking)
      - Jaccard similarity on 'hobbies' list
      - Final score = 0.8 * trait_sim + 0.2 * hobby_sim
    Returns a percentage in [0,100], rounded to 2 decimals.
    """
    # Extract and remove hobbies for separate handling
    h1 = v1.pop('hobbies', [])
    h2 = v2.pop('hobbies', [])

    # 1) Jaccard hobby similarity in [0,1]
    hobby_sim = jaccard(h1, h2)

    # 2) Euclidean distance on remaining features
    # All features in v1/v2 now normalized to [0,1]
    dist = sqrt(sum((v1[key] - v2[key]) ** 2 for key in v1))
    max_dist = sqrt(len(v1))  # if every feature differed by 1
    trait_sim = 1 - (dist / max_dist)

    # 3) Weighted combination
    final_sim = 0.8 * trait_sim + 0.2 * hobby_sim

    # Convert to percentage
    return round(final_sim * 100, 2)
