# ml-service/src/preprocessing.py

def profile_to_vector(p: dict) -> dict:
    # 1) Normalize age as a distance from an “ideal” age (e.g. 30) over range 18–80
    ideal_age = 30
    min_age, max_age = 18, 80
    age_dist = abs(p['age'] - ideal_age) / (max_age - min_age)

    # 2) Big Five traits into [0,1]
    traits = {
        f"trait_{i}": (p[name] - 1) / 4
        for i, name in enumerate([
            'openness',
            'conscientiousness',
            'extraversion',
            'agreeableness',
            'neuroticism'
        ])
    }

    # 3) Smoking & drinking mapped to [0,1]
    smoke_map = {'no': 0.0, 'occasionally': 0.5, 'yes': 1.0}
    drink_map = {'no': 0.0, 'occasionally': 0.5, 'yes': 1.0}
    smoking = smoke_map.get(p.get('smoking', '').lower(), 0.0)
    drinking = drink_map.get(p.get('drinking', '').lower(), 0.0)

    # Assemble feature dict
    features = {
        **traits,
        "age_dist": age_dist,
        "smoking": smoking,
        "drinking": drinking,
        # leave hobbies list intact for Jaccard in model
        "hobbies": p.get('hobbies', [])
    }

    return features
