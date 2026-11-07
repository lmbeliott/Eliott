import json, random
random.seed(2026)

def test(scores):
    return f"{len(scores)}\n" + " ".join(map(str, scores)) + "\n"

tests = [
    test([50, 80, 50, 90]),
    test([12, 7, 12, 12, 30, 7, 0]),
]
tests += [
    test([42]),
    test([0]),
    test([5, 5, 5, 5, 5]),                                  # tout le monde premier
    test([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),                  # déjà dans l'ordre inverse du classement
    test([1000000, 999999, 1000000, 0, 0, 1]),
    test([random.randint(0, 20) for _ in range(30)]),
    test([random.randint(0, 100) for _ in range(500)]),
    test([random.randint(0, 1000000) for _ in range(10000)]),   # presque tous différents
    test([random.randint(0, 50) for _ in range(10000)]),        # beaucoup d'ex aequo
    test([random.choice([0, 1000000]) for _ in range(10000)]),
    test(list(range(10000, 0, -1))),
]
print(json.dumps(tests))
