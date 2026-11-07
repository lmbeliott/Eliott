import json, random
from collections import deque
random.seed(2026)

KMAX = 10**9


def distances(n, aretes):
    # (distance paire, distance impaire) depuis le sommet 1, pour choisir des questions intéressantes
    voisins = [[] for _ in range(n + 1)]
    for a, b in aretes:
        voisins[a].append(b)
        voisins[b].append(a)
    dist = [[-1] * (n + 1), [-1] * (n + 1)]
    dist[0][1] = 0
    file = deque([(1, 0)])
    while file:
        u, p = file.popleft()
        for v in voisins[u]:
            if dist[1 - p][v] == -1:
                dist[1 - p][v] = dist[p][u] + 1
                file.append((v, 1 - p))
    return dist


def questions(n, aretes, q):
    dist = distances(n, aretes)
    res = []
    for _ in range(q):
        v = random.randint(1, n)
        genre = random.randint(1, 4)
        d = dist[random.randint(0, 1)][v]
        if genre == 1 or d == -1:
            k = random.randint(0, KMAX)
        elif genre == 2:
            k = random.randint(0, 2 * n)
        else:
            k = max(0, d + random.randint(-2, 3))   # autour de la plus petite longueur possible
        res.append((v, k))
    return res


def fmt(n, aretes, qs):
    return (f"{n} {len(aretes)}\n" + "".join(f"{a} {b}\n" for a, b in aretes)
            + f"{len(qs)}\n" + "".join(f"{v} {k}\n" for v, k in qs))


def melange(n, aretes):
    # renumérote les sommets au hasard, en gardant le sommet 1 à sa place
    reste = list(range(2, n + 1))
    random.shuffle(reste)
    perm = [0, 1] + reste
    res = [(perm[a], perm[b]) if random.random() < 0.5 else (perm[b], perm[a]) for a, b in aretes]
    random.shuffle(res)
    return res


def aleatoire(n, m):
    aretes = []
    for _ in range(m):
        a = random.randint(1, n)
        b = random.randint(1, n)
        while b == a:
            b = random.randint(1, n)
        aretes.append((a, b))
    return aretes


def grille(lignes, colonnes, p):
    # une grille est biparti : chaque sommet n'est atteint qu'avec une seule parité
    aretes = []
    for r in range(lignes):
        for c in range(colonnes):
            v = r * colonnes + c + 1
            if c + 1 < colonnes and random.random() < p:
                aretes.append((v, v + 1))
            if r + 1 < lignes and random.random() < p:
                aretes.append((v, v + colonnes))
    return aretes


def avec_questions(n, aretes, q):
    aretes = melange(n, aretes)
    return fmt(n, aretes, questions(n, aretes, q))


tests = [
    "5 5\n1 2\n2 3\n3 4\n4 1\n4 5\n5\n5 2\n5 3\n5 6\n3 1\n3 2\n",
    "4 4\n1 2\n2 3\n3 1\n3 4\n5\n4 1\n4 2\n4 3\n1 1\n1 3\n",
    "3 1\n2 3\n3\n1 0\n1 2\n2 1\n",
]
tests.append("1 0\n4\n1 0\n1 1\n1 2\n1 1000000000\n")
tests.append("2 1\n1 2\n6\n1 0\n1 1\n1 2\n2 1\n2 2\n2 999999999\n")
tests.append("2 2\n2 1\n1 2\n3\n1 1000000000\n2 1000000000\n2 999999999\n")
tests.append(avec_questions(12, aleatoire(12, 10), 40))
tests.append(avec_questions(30, grille(5, 6, 0.8), 60))
# Sommet 1 isolé dans un grand graphe
n = 1000
aretes = [(a, b) for a, b in aleatoire(n, 1500) if a != 1 and b != 1]
qs = [(1, 0)] + [(1, 2 * random.randint(1, 50)) for _ in range(20)] + questions(n, aretes, 100)
random.shuffle(qs)
tests.append(fmt(n, melange(n, aretes), qs))
# Long chemin, avec un cycle impair (triangle) tout au bout
n = 3000
aretes = [(i, i + 1) for i in range(1, n - 1)] + [(n - 1, n), (n, n - 2)]
tests.append(avec_questions(n, aretes, 1000))
# Grands cas
tests.append(avec_questions(5000, aleatoire(5000, 8000), 5000))
tests.append(avec_questions(4000, grille(40, 100, 0.95), 4000))
# Grand graphe biparti sauf une arête qui crée un cycle impair loin du départ
n = 5000
camp = [0] + [random.randint(0, 1) for _ in range(n)]
camp[1] = 0
aretes = []
while len(aretes) < 5999:
    a, b = random.randint(1, n), random.randint(1, n)
    if camp[a] != camp[b]:
        aretes.append((a, b))
a, b = random.choice([(a, b) for a in range(2, n + 1) for b in [random.randint(2, n)] if a != b and camp[a] == camp[b]])
aretes.append((a, b))
tests.append(avec_questions(n, aretes, 1500))
print(json.dumps(tests))
