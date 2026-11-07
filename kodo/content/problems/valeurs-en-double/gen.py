import json, random
random.seed(2026)

M = 10**6

def test(liste):
    return f"{len(liste)}\n" + " ".join(map(str, liste)) + "\n"

tests = [test([4, -1, 7, 4, 4, -1, 0, 9]), test([5, 6, 7])]
tests += [
    test([3]),                                  # un seul nombre
    test([0, 0]),
    test([8] * 10),                             # toujours la même valeur
    test([-5, -1, -5, -1, 3, -10, -10, -10]),   # des négatifs
    test([M, -M, M, -M, 0]),
    test(list(range(-5000, 5000))),             # toutes différentes : 0
    test([random.randint(-M, M) for _ in range(10000)]),     # quelques doublons
    test([random.randint(-50, 50) for _ in range(10000)]),   # beaucoup de doublons
    test([random.randint(-3000, 3000) for _ in range(10000)]),
    test([random.choice([7, -7, 70]) for _ in range(100)]),
]
for _ in range(2):
    tests.append(test([random.randint(-20, 20) for _ in range(random.randint(5, 30))]))
print(json.dumps(tests))
