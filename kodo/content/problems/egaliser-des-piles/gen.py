import json, random
random.seed(2026)

def test(piles):
    assert sum(piles) % len(piles) == 0
    return f"{len(piles)}\n" + " ".join(map(str, piles)) + "\n"

def hasard(n, haut=1000):
    piles = [random.randint(0, haut) for _ in range(n - 1)]
    dernier = (-sum(piles)) % n
    while dernier + n <= haut and random.random() < 0.7:
        dernier += n
    return test(piles + [dernier])

tests = [test([1, 2, 6]), test([0, 8, 0, 4])]
tests += [
    test([5]),                              # une seule pile
    test([7, 7, 7, 7]),                     # déjà égales
    test([0, 0, 0]),
    test([0, 0, 0, 0, 15]),                 # tout est à droite
    test([12, 0, 0, 0, 0, 0]),              # tout est à gauche
    test([4, 0, 4, 0, 4, 0, 4, 0, 4, 0]),
    test([1000] * 500 + [0] * 500),         # la moitié gauche est pleine
    test([0, 1000] * 500),
    test([1000] + [0] * 998 + [1000]),
    test([0] * 999 + [1000]),
]
for n in [10, 100, 1000, 1000, 999]:
    tests.append(hasard(n))
tests.append(hasard(1000, 20))
print(json.dumps(tests))
