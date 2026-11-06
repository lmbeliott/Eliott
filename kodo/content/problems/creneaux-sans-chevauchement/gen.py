import json, random
random.seed(2026)

def test(creneaux):
    return f"{len(creneaux)}\n" + "".join(f"{d} {l}\n" for d, l in creneaux)

def aleatoire(n, horizon, duree_max):
    return [(random.randint(0, horizon), random.randint(1, duree_max)) for _ in range(n)]

tests = [
    test([(0, 60), (30, 60), (60, 30), (100, 20), (90, 15), (120, 45)]),
    test([(10, 300), (20, 30), (60, 30), (100, 30)]),
    test([(0, 1)]),
    test([(5, 10), (5, 10), (5, 10)]),              # tous identiques
    test([(0, 10), (10, 10), (20, 10), (30, 10)]),  # bout à bout : tous acceptés
    test([(0, 100), (1, 1), (2, 1), (3, 1), (50, 60)]),
    test([(99999, 500), (0, 500), (99000, 500)]),
    test(aleatoire(12, 100, 30)),
]
tests.append(test(aleatoire(3000, 99999, 500)))
tests.append(test(aleatoire(5000, 20000, 50)))
# tailles maximales
tests.append(test(aleatoire(15000, 99999, 500)))
tests.append(test(aleatoire(15000, 99999, 40)))
print(json.dumps(tests))
