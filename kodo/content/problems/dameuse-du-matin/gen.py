import json, random
random.seed(2026)

def test(pistes):
    return f"{len(pistes)}\n" + "".join(f"{d} {f}\n" for d, f in pistes)

def aleatoire(n, dmax, fmax):
    return [(random.randint(1, dmax), random.randint(1, fmax)) for _ in range(n)]

tests = [
    test([(30, 10), (10, 2), (20, 8)]),
    test([(60, 100), (5, 1), (40, 80), (20, 30)]),
    test([(17, 4)]),
    test([(10, 10)] * 5),                          # tout identique
    test([(2, 4), (3, 6), (1, 2), (5, 10)]),       # même rapport partout : l'ordre ne change rien
    test([(1000, 1), (1, 1000), (500, 500), (1, 1)]),
    test([(5, 1), (1, 3), (4, 2), (2, 2), (3, 5)]),
    test(aleatoire(10, 50, 50)),
]
tests.append(test(aleatoire(2000, 1000, 1000)))
tests.append(test(aleatoire(5000, 100, 1000)))
# tailles maximales (réponse > 2^31)
tests.append(test(aleatoire(15000, 1000, 1000)))
tests.append(test([(1000, 1000)] * 7000 + aleatoire(8000, 1000, 1000)))
print(json.dumps(tests))
