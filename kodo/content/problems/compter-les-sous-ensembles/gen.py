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
# Liste et requêtes aux valeurs presque toutes différentes : garder en mémoire la réponse de
# chaque requête déjà vue ne fait rien gagner. Les requêtes sont les 10 000 ensembles qui ont
# le plus d'éléments : énumérer leurs sous-ensembles coûte des dizaines de millions d'étapes.
liste = [random.randint(0, TOUT) for _ in range(10000)]
requetes = sorted(range(TOUT + 1), key=lambda m: -bin(m).count("1"))[:10000]
random.shuffle(requetes)
tests.append(fmt(liste, requetes))
tests.append(fmt([random.randint(0, TOUT) for _ in range(10000)], [random.randint(0, TOUT) for _ in range(10000)]))
print(json.dumps(tests))
