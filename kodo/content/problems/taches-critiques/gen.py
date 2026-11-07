import json, random
random.seed(2026)


def fmt(duree, contraintes):
    return (f"{len(duree)} {len(contraintes)}\n" + " ".join(map(str, duree)) + "\n"
            + "".join(f"{a} {b}\n" for a, b in contraintes))


def melange(n, duree, contraintes):
    # Renumérote les tâches au hasard et mélange l'ordre des contraintes.
    perm = list(range(1, n + 1))
    random.shuffle(perm)
    d2 = [0] * n
    for v in range(n):
        d2[perm[v] - 1] = duree[v]
    c2 = [(perm[a], perm[b]) for a, b in contraintes]
    random.shuffle(c2)
    return fmt(d2, c2)


def dag(n, m, dmax, couches=None):
    # Contraintes dirigées des petits indices vers les grands (donc sans cycle).
    duree = [random.randint(1, dmax) for _ in range(n)]
    contraintes = []
    for _ in range(m):
        if couches:
            a = random.randrange(n - 1)
            b = min(n - 1, a + random.randint(1, couches))
        else:
            a, b = sorted(random.sample(range(n), 2))
        contraintes.append((a, b))
    return n, duree, contraintes


tests = [
    fmt([3, 2, 4, 1, 5, 2], [(1, 2), (1, 3), (2, 4), (3, 4), (4, 6), (5, 6)]),
    fmt([4, 1, 2], [(1, 2), (2, 3), (3, 2)]),
]
tests.append(fmt([7], []))
tests.append(fmt([5, 3, 5, 1, 5], []))                     # aucune contrainte : les tâches les plus longues
tests.append(fmt([2, 2, 3, 3], [(1, 2), (3, 4), (1, 2), (3, 4), (1, 4)]))   # contraintes en double
tests.append(fmt([1, 1], [(1, 2), (2, 1)]))                 # cycle de longueur 2
# Deux chaînes parallèles de même durée totale : toutes les tâches sont critiques.
tests.append(melange(8, [2, 3, 4, 1, 5, 1, 2, 2], [(0, 1), (1, 2), (2, 3), (4, 5), (5, 6), (6, 7)]))
n, d, c = dag(40, 70, 9, couches=4)
tests.append(melange(n, d, c))
# Une chaîne de 6000 tâches, numérotées à l'envers, plus des raccourcis.
n = 6000
d = [random.randint(1, 1000) for _ in range(n)]
c = [(v + 1, v) for v in range(n - 1)]
for _ in range(2000):
    a = random.randint(2, n - 1)
    c.append((a, max(0, a - random.randint(2, 50))))
random.shuffle(c)
tests.append(fmt(d, [(a + 1, b + 1) for a, b in c]))
# Grands graphes sans cycle.
n, d, c = dag(6000, 8000, 1000, couches=30)
tests.append(melange(n, d, c))
n, d, c = dag(6000, 8000, 3, couches=200)               # petites durées : beaucoup d'égalités
tests.append(melange(n, d, c))
n, d, c = dag(1500, 2000, 1000)
tests.append(melange(n, d, c))
# Un grand graphe avec un seul cycle, long, caché au milieu.
n, d, c = dag(4000, 2500, 1000, couches=20)
c.append((3500, 500))
c += [(v, v + 1) for v in range(500, 3500)]
tests.append(melange(n, d, c))
print(json.dumps(tests))
