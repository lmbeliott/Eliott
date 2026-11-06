import json, random
random.seed(2026)

def test(k, troncons):
    return f"{len(troncons)} {k}\n" + " ".join(map(str, troncons)) + "\n"

def aleatoire(n, lo=1, hi=99):
    return [random.randint(lo, hi) for _ in range(n)]

tests = [
    test(3, [12, 7, 9, 15, 4, 8]),
    test(4, [5, 9, 3, 9]),
    test(1, [42]),
    test(1, [10, 20, 30]),                  # un seul jour : tout le parcours
    test(2, [1, 1, 1, 1, 50]),              # le plus long tronçon impose la réponse
    test(3, [7] * 9),
    test(2, [99, 1, 1, 1, 1, 1, 1, 99]),
    test(4, aleatoire(20)),
]
tests.append(test(17, aleatoire(3000)))
tests.append(test(2, aleatoire(10000, 90, 99)))
tests.append(test(2500, aleatoire(10000)))
# tailles maximales
tests.append(test(2, aleatoire(50000)))
tests.append(test(37, aleatoire(50000)))
print(json.dumps(tests))
