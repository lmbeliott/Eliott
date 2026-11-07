import json, random
random.seed(2026)

def test(seuils, ajouts):
    lignes = [f"{len(seuils)} {len(ajouts)}", " ".join(map(str, seuils))]
    lignes += [f"{l} {r} {v}" for l, r, v in ajouts]
    return "\n".join(lignes) + "\n"

def valeurs_apres(n, ajouts, k):
    diff = [0] * (n + 2)
    for l, r, v in ajouts[:k]:
        diff[l] += v
        diff[r + 1] -= v
    vals, cour = [], 0
    for i in range(1, n + 1):
        cour += diff[i]
        vals.append(cour)
    return vals

def plante(n, m, k, vmax, longueur_min, marge, impossible=False):
    # des ajouts aléatoires, puis des seuils choisis pour que la réponse soit exactement k
    # (ou -1 si impossible) ; le premier ajout couvre tout pour qu'aucune case ne reste à 0
    ajouts = [(1, n, random.randint(1, vmax))]
    while len(ajouts) < m:
        lg = random.randint(min(n, longueur_min), n)
        l = random.randint(1, n - lg + 1)
        ajouts.append((l, l + lg - 1, random.randint(1, vmax)))
    vals = valeurs_apres(n, ajouts, k)
    seuils = [max(1, x - random.randint(0, marge)) for x in vals]
    l, r, _ = ajouts[k - 1]
    j = random.randint(l, r) - 1          # cette case atteint son seuil pile au k-ième ajout
    seuils[j] = vals[j] + (1 if impossible else 0)
    assert max(seuils) <= 10**6
    return test(seuils, ajouts)

tests = [
    test([3, 1, 4, 2, 2], [(1, 3, 2), (3, 5, 2), (2, 4, 1), (1, 2, 1), (1, 5, 1)]),
    test([5, 1, 5], [(1, 2, 3), (2, 3, 4)]),
    test([7], [(1, 1, 7)]),                                  # un seul ajout, pile assez
    test([8], [(1, 1, 7)]),                                  # pas assez : -1
    test([2, 2, 2, 2], [(1, 4, 5), (1, 1, 1), (2, 3, 1)]),   # le premier ajout suffit
    test([1, 1, 1, 1, 1], [(1, 1, 1), (2, 2, 1), (3, 3, 1), (4, 4, 1), (5, 5, 1)]),  # le dernier compte
    test([10**6] * 3, [(1, 3, 1000)] * 1000),                # exactement 1 000 ajouts
    test([1, 1, 1, 1, 1, 1], [(2, 6, 3), (1, 5, 1), (3, 3, 9)]),
    plante(8, 10, 6, 5, 1, 3),
    plante(30, 40, 33, 20, 5, 10),
    plante(30, 40, 40, 20, 5, 10, impossible=True),
    plante(200, 300, 271, 1000, 50, 2000),
    plante(2000, 1500, 777, 300, 300, 100),
    plante(12000, 600, 1, 9, 6000, 5),                       # grand, mais la réponse est 1
    # tailles maximales : la réponse arrive tard et les ajouts sont longs
    plante(12000, 5000, 4997, 9, 6000, 20),
    plante(12000, 5000, 5000, 9, 6000, 20, impossible=True),
]
print(json.dumps(tests))
