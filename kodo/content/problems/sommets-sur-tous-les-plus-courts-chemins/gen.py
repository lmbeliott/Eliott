import json, random
random.seed(2026)


def fmt(n, s, t, aretes):
    return f"{n} {len(aretes)} {s} {t}\n" + "".join(f"{a} {b}\n" for a, b in aretes)


def melange(n, s, t, aretes):
    # renumérote les sommets au hasard et mélange les arêtes
    perm = list(range(n + 1))
    reste = perm[1:]
    random.shuffle(reste)
    perm[1:] = reste
    res = []
    for a, b in aretes:
        a, b = perm[a], perm[b]
        res.append((a, b) if random.random() < 0.5 else (b, a))
    random.shuffle(res)
    return fmt(n, perm[s], perm[t], res)


def chemin_avec_detours(n, longueur, nb_detours, nb_raccourcis):
    # chemin principal 1 - 2 - ... - (longueur + 1), plus des détours plus longs
    # (qui ne changent rien) et des « doublures » de même longueur (qui retirent des sommets obligatoires)
    aretes = [(i, i + 1) for i in range(1, longueur + 1)]
    libre = longueur + 2
    for _ in range(nb_detours + nb_raccourcis):
        doublure = len(aretes) < longueur + nb_raccourcis * 4 and random.random() < nb_raccourcis / (nb_detours + nb_raccourcis)
        a = random.randint(1, longueur - 10)
        ecart = random.randint(2, 6)
        b = a + ecart
        # une doublure a la même longueur que le morceau de chemin, un détour est plus long
        k = ecart if doublure else ecart + random.randint(1, 3)
        if libre + k - 1 > n:
            break
        nouveaux = list(range(libre, libre + k - 1))
        libre += k - 1
        suite = [a] + nouveaux + [b]
        aretes += [(suite[i], suite[i + 1]) for i in range(len(suite) - 1)]
    # sommets restants : petits arbres accrochés au hasard
    for v in range(libre, n + 1):
        aretes.append((v, random.randint(1, v - 1)))
    return aretes


def aleatoire(n, m):
    aretes = []
    for _ in range(m):
        a = random.randint(1, n)
        b = random.randint(1, n)
        while b == a:
            b = random.randint(1, n)
        aretes.append((a, b))
    return aretes


tests = [
    "7 8 1 7\n1 2\n1 3\n2 4\n3 4\n4 5\n5 7\n4 6\n6 7\n",
    "7 7 1 5\n1 2\n2 3\n3 5\n1 4\n4 6\n6 7\n7 5\n",
]
tests.append("2 1 1 2\n1 2\n")
tests.append("2 3 2 1\n1 2\n2 1\n1 2\n")
tests.append("3 0 1 3\n")
tests.append("5 3 4 1\n1 2\n2 3\n4 5\n")             # T inaccessible
# Cycle pair : deux chemins disjoints de même longueur
tests.append(fmt(10, 1, 6, [(i, i % 10 + 1) for i in range(1, 11)]))
# Cycle impair : un seul plus court chemin
tests.append(fmt(9, 1, 4, [(i, i % 9 + 1) for i in range(1, 10)]))
tests.append(melange(30, 1, 18, chemin_avec_detours(30, 17, 3, 1)))
tests.append(melange(60, 1, 2, aleatoire(60, 90)))
# Grands cas
n = 10000
tests.append(melange(9000, 1, 3001, chemin_avec_detours(9000, 3000, 700, 150)))
tests.append(melange(n, 1, 2, aleatoire(n, 10000)))
arbre = [(v, random.randint(max(1, v - 3), v - 1)) for v in range(2, 4001)]
tests.append(melange(4000, 1, 4000, arbre))
# Grille 50 × 100 avec des arêtes retirées
L, C = 50, 100
aretes = []
for r in range(L):
    for c in range(C):
        v = r * C + c + 1
        if c + 1 < C and random.random() < 0.8:
            aretes.append((v, v + 1))
        if r + 1 < L and random.random() < 0.8:
            aretes.append((v, v + C))
tests.append(melange(L * C, 1, L * C, aretes))
# Deux grandes composantes : T inaccessible
moitie = 1500
aretes = [(v, random.randint(1, v - 1)) for v in range(2, moitie + 1)]
aretes += [(v, random.randint(moitie + 1, v - 1)) for v in range(moitie + 2, 2 * moitie + 1)]
tests.append(melange(2 * moitie, 1, 2 * moitie, aretes))
print(json.dumps(tests))
