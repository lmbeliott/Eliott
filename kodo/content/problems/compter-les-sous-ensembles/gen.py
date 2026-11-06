import json, random
random.seed(2026)

TOUT = (1 << 16) - 1


def fmt(liste, requetes):
    return f"{len(liste)} {len(requetes)}\n" + " ".join(map(str, liste)) + "\n" + " ".join(map(str, requetes)) + "\n"


def ensemble(p):
    # Chaque élément est dans l'ensemble avec probabilité p.
    return sum(1 << b for b in range(16) if random.random() < p)


tests = [
    fmt([13, 4, 6, 1, 13], [13, 7, 65535, 4]),
    fmt([0, 3, 2], [0, 1, 2, 3]),
]
tests.append(fmt([0], [0]))
tests.append(fmt([TOUT], [TOUT, TOUT - 1, 0]))
tests.append(fmt([1 << b for b in range(16)], [0, 1, 3, 255, 1 << 15, TOUT, 21845, 43690]))
tests.append(fmt([random.randint(0, 15) for _ in range(20)], [random.randint(0, 15) for _ in range(20)]))
tests.append(fmt([ensemble(0.3) for _ in range(500)], [ensemble(0.7) for _ in range(500)]))
# Tous les ensembles de la liste sont égaux.
tests.append(fmt([4242] * 3000, [4242, 4243, 4240, TOUT, 0] * 200))
# Grands cas.
tests.append(fmt([ensemble(0.2) for _ in range(10000)], [ensemble(0.8) for _ in range(10000)]))
tests.append(fmt([ensemble(random.choice([0.05, 0.3, 0.6])) for _ in range(10000)],
                 [ensemble(random.choice([0.5, 0.9, 0.97])) for _ in range(10000)]))
# Requêtes presque pleines : énumérer les sous-ensembles de chaque requête coûte 2¹⁶.
tests.append(fmt([random.randint(0, TOUT) for _ in range(10000)], [TOUT ^ (1 << random.randrange(16)) for _ in range(10000)]))
print(json.dumps(tests))
