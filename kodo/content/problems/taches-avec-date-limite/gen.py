import json, random
random.seed(2026)

def test(taches):
    return f"{len(taches)}\n" + "".join(f"{d} {g}\n" for d, g in taches)

def aleatoire(n, dmax, gmax):
    return [(random.randint(1, dmax), random.randint(1, gmax)) for _ in range(n)]

tests = [
    test([(2, 50), (1, 10), (2, 40), (1, 30)]),
    test([(3, 5), (1, 8), (3, 6), (2, 9), (3, 7), (1, 4)]),
    test([(1, 100)]),
    test([(1, 5), (1, 9), (1, 7)]),                       # une seule tâche possible
    test([(10**9, 3), (10**9, 4), (10**9, 5)]),           # tout est faisable
    test([(4, 10)] * 6),                                  # tout identique
    test([(1, 1), (2, 1), (2, 100), (3, 1), (3, 100)]),
    test(aleatoire(12, 5, 50)),
    test(aleatoire(200, 60, 1000)),
    test(aleatoire(3000, 1000, 10000)),
    test(aleatoire(2000, 10**9, 10000)),                  # dates limites énormes
]
# tailles maximales : beaucoup de tâches pour peu de jours
tests.append(test(aleatoire(15000, 5000, 999)))
tests.append(test(aleatoire(15000, 100000, 10000)))
print(json.dumps(tests))
