import json, random
random.seed(2026)

C_MAX = 10**6


def fmt(n, imposes, aretes):
    lignes = [f"{n} {len(aretes)} {len(imposes)}", " ".join(map(str, imposes))]
    lignes += [f"{u} {v} {c}" for u, v, c in aretes]
    return "\n".join(lignes) + "\n"


def melange(n, imposes, aretes):
    # Renumérote les sommets au hasard et mélange les arêtes
    perm = list(range(1, n + 1))
    random.shuffle(perm)
    aretes = [(perm[u - 1], perm[v - 1], c) for u, v, c in aretes]
    random.shuffle(aretes)
    return fmt(n, [perm[t - 1] for t in imposes], aretes)


def graphe_aleatoire(n, m, cmin, cmax):
    # Un arbre couvrant aléatoire (pour la connexité), puis des arêtes en plus, sans doublon
    paires = set()
    for i in range(2, n + 1):
        paires.add((random.randint(max(1, i - 50), i - 1), i))
    while len(paires) < m:
        u, v = random.sample(range(1, n + 1), 2)
        paires.add((min(u, v), max(u, v)))
    return [(u, v, random.randint(cmin, cmax)) for u, v in paires]


def grille(h, l, cmin, cmax):
    aretes = []
    for i in range(h):
        for j in range(l):
            x = i * l + j + 1
            if j + 1 < l:
                aretes.append((x, x + 1, random.randint(cmin, cmax)))
            if i + 1 < h:
                aretes.append((x, x + l, random.randint(cmin, cmax)))
    return aretes


def etoile_piege(k, rayon, direct):
    # k sommets imposés reliés deux à deux (coût direct) et tous à un centre non imposé (coût rayon) :
    # passer par le centre est moins cher, mais aucun plus court chemin entre deux imposés n'y passe.
    centre = k + 1
    aretes = [(i, j, direct) for i in range(1, k + 1) for j in range(i + 1, k + 1)]
    aretes += [(i, centre, rayon) for i in range(1, k + 1)]
    return k + 1, list(range(1, k + 1)), aretes


tests = [
    fmt(4, [1, 2, 3], [(1, 2, 8), (2, 3, 8), (1, 3, 8), (1, 4, 5), (2, 4, 5), (3, 4, 5)]),
    fmt(6, [2, 5, 6], [(1, 2, 3), (2, 3, 4), (3, 4, 2), (4, 5, 6), (3, 6, 5), (1, 6, 9), (4, 6, 1)]),
]
# Cas limites : un seul sommet imposé, deux sommets, tous les sommets imposés (arbre couvrant minimal)
tests.append(fmt(3, [2], [(1, 2, 5), (2, 3, 7)]))
tests.append(fmt(2, [2, 1], [(1, 2, C_MAX)]))
tests.append(melange(7, list(range(1, 8)), graphe_aleatoire(7, 12, 1, 20)))
# Pièges : l'arbre couvrant minimal des distances entre imposés, ou les ajouts gloutons
# de plus courts chemins, n'utilisent pas les centres.
n, imp, ar = etoile_piege(7, 10, 19)
tests.append(melange(n, imp, ar))
# Deux étoiles dont les centres sont reliés
aretes = [(1, 2, 19), (1, 3, 19), (2, 3, 19), (4, 5, 19), (4, 6, 19), (5, 6, 19), (3, 4, 30)]
aretes += [(i, 7, 10) for i in (1, 2, 3)] + [(i, 8, 10) for i in (4, 5, 6)] + [(7, 8, 25)]
tests.append(melange(8, [1, 2, 3, 4, 5, 6], aretes))
# Petits et moyens cas aléatoires
tests.append(melange(30, random.sample(range(1, 31), 5), graphe_aleatoire(30, 60, 1, 30)))
tests.append(fmt(900, random.sample(range(1, 901), 7), grille(30, 30, 1, 1000)))
# Grands cas : K = 7, un millier de sommets
tests.append(melange(1000, random.sample(range(1, 1001), 7), graphe_aleatoire(1000, 3000, 1, C_MAX)))
tests.append(fmt(992, random.sample(range(1, 993), 7), grille(31, 32, 1, 10)))
cycle = [(i, i % 1000 + 1, random.randint(1, 1000)) for i in range(1, 1001)]
cordes = set()
while len(cordes) < 1000:
    u, v = random.sample(range(1, 1001), 2)
    if abs(u - v) not in (1, 999):
        cordes.add((min(u, v), max(u, v)))
cycle += [(u, v, random.randint(500, C_MAX)) for u, v in cordes]
tests.append(melange(1000, random.sample(range(1, 1001), 7), cycle))
tests.append(melange(500, random.sample(range(1, 501), 6), graphe_aleatoire(500, 3000, 1, 50)))
print(json.dumps(tests))
