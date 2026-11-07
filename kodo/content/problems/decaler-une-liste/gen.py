import json, random
random.seed(2026)

def test(k, liste):
    return f"{len(liste)} {k}\n" + " ".join(map(str, liste)) + "\n"

def hasard(n):
    return [random.randint(-1000, 1000) for _ in range(n)]

tests = [test(2, [1, 2, 3, 4, 5]), test(6, [10, 20, 30, 40])]
tests += [
    test(0, [7, -3, 5]),                  # pas de décalage
    test(3, [7, -3, 5]),                  # un tour complet
    test(1000000000, [42]),               # un seul élément
    test(1, [1, 2, 3, 4, 5, 6]),
    test(5, [1, 2, 3, 4, 5, 6]),
    test(4, [9, 9, 1, 9]),
    test(999, hasard(1000)),
    test(1000000000, hasard(1000)),
    test(123456789, hasard(1000)),
    test(1000, hasard(1000)),
]
for _ in range(3):
    n = random.randint(1, 50)
    tests.append(test(random.randint(0, 200), hasard(n)))
print(json.dumps(tests))
