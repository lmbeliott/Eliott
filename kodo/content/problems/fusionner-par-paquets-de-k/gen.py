import json, random
random.seed(2026)

def test(k, tas):
    return f"{len(tas)} {k}\n" + " ".join(map(str, tas)) + "\n"

def aleatoire(n, lo=1, hi=10000):
    return [random.randint(lo, hi) for _ in range(n)]

tests = [
    test(3, [5, 1, 2, 4]),
    test(3, [3, 3, 3, 3, 3, 3]),
    test(2, [7]),                                  # un seul tas : rien à fusionner
    test(2, [4, 9]),
    test(5, [8, 2, 6]),                            # K plus grand que N : une seule fusion
    test(2, [1, 2, 3, 4, 5, 6, 7, 8]),
    test(4, [10, 10, 10, 10, 10]),
    test(3, aleatoire(10, 1, 50)),
    test(7, aleatoire(100)),
    test(10, aleatoire(2000, 1, 100)),
    test(30000, aleatoire(500)),
]
# tailles maximales
tests.append(test(2, aleatoire(25000, 9000, 10000)))
tests.append(test(3, aleatoire(25000)))
tests.append(test(1000, aleatoire(25000, 9000, 10000)))
print(json.dumps(tests))
