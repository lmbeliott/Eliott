import json, random
random.seed(2026)

N_MAX = 18


def fmt(taches):
    return f"{len(taches)}\n" + "".join(f"{p} {d} {w}\n" for p, d, w in taches)


def aleatoire(n, pmax, wmax, serre):
    # serre : les limites sont tirées dans [0, serre × somme des durées]
    p = [random.randint(1, pmax) for _ in range(n)]
    s = sum(p)
    return [(p[i], random.randint(0, int(serre * s)), random.randint(1, wmax)) for i in range(n)]


tests = [
    fmt([(3, 4, 2), (2, 2, 5), (4, 9, 1)]),
    fmt([(5, 5, 1), (1, 6, 10), (2, 3, 3), (4, 12, 2)]),
]
# Une seule tâche, aucun retard possible, tout en retard
tests.append(fmt([(7, 3, 4)]))
tests.append(fmt([(2, 100, 5), (3, 100, 1), (4, 100, 9)]))
tests.append(fmt([(10, 0, 3), (1, 0, 1), (5, 0, 2), (8, 0, 7)]))


def cout(taches, ordre):
    t = c = 0
    for i in ordre:
        p, d, w = taches[i]
        t += p
        c += w * max(0, t - d)
    return c


def optimum(taches):
    n = len(taches)
    best = [0] * (1 << n)
    for m in range(1, 1 << n):
        t = sum(taches[j][0] for j in range(n) if m >> j & 1)
        best[m] = min(best[m ^ (1 << j)] + taches[j][2] * max(0, t - taches[j][1]) for j in range(n) if m >> j & 1)
    return best[-1]


def piege(n):
    # Cherche un cas où trois gloutons classiques se trompent tous
    while True:
        taches = aleatoire(n, 12, 9, 0.6)
        ordres = [
            sorted(range(n), key=lambda i: taches[i][1]),                    # plus petite limite
            sorted(range(n), key=lambda i: taches[i][0] / taches[i][2]),     # durée / poids
            sorted(range(n), key=lambda i: taches[i][1] - taches[i][0]),     # plus petite marge
        ]
        opt = optimum(taches)
        if all(cout(taches, o) > opt for o in ordres):
            return taches


# Pièges pour les gloutons
tests.append(fmt(piege(5)))
tests.append(fmt(piege(7)))
tests.append(fmt(aleatoire(8, 20, 10, 0.6)))
tests.append(fmt(aleatoire(12, 100, 50, 0.5)))
# Grands cas : N = 18, durées et poids grands (le résultat dépasse 2^31)
for serre in (0.3, 0.6, 0.9):
    tests.append(fmt(aleatoire(N_MAX, 100000, 10000, serre)))
tests.append(fmt([(random.randint(90000, 100000), 0, random.randint(9000, 10000)) for _ in range(N_MAX)]))
tests.append(fmt(aleatoire(N_MAX, 10, 3, 0.5)))
tests.append(fmt([(1 + i % 4, 3 + 2 * i, 1 + (7 * i) % 5) for i in range(15)]))
tests.append(fmt(piege(10)))
print(json.dumps(tests))
