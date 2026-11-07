import json, random
random.seed(2026)

def test(nombres):
    return f"{len(nombres)}\n" + " ".join(map(str, nombres)) + "\n"

def aleatoire(n, lo, hi):
    return [random.randint(lo, hi) for _ in range(n)]

tests = [
    test([7, 3, 2, 9, 4]),
    test([10, 1, 1, 1]),
    test([42]),                                   # un seul nombre : l'autre groupe est vide
    test([5, 5]),                                 # différence nulle
    test([1, 2, 4, 8, 16, 32, 64, 128, 256, 1000]),
    test([10**12] * 7),                           # nombre impair de valeurs égales
    test(aleatoire(15, 1, 100)),
    test(aleatoire(20, 1, 10**12)),
    test(aleatoire(27, 10**11, 10**12)),
    test([3**i for i in range(25)]),              # puissances de 3 : le plus grand domine
]
# tailles maximales : 2^36 répartitions, impossible de toutes les essayer
tests.append(test(aleatoire(36, 1, 10**12)))
tests.append(test(aleatoire(36, 999_000_000_000, 10**12)))
tests.append(test([2 * x for x in aleatoire(35, 1, 5 * 10**11)] + [1]))   # total impair
tests.append(test(aleatoire(35, 1, 10**6)))
print(json.dumps(tests))
