import json, random
random.seed(2026)


def melange(n, pere):
    # pere[k] (k ≥ 1) : parent, créé avant lui, du k-ième sommet créé. Les numéros sont
    # mélangés, la racine reste 1. Renvoie parent[2..N].
    numero = [1] + random.sample(range(2, n + 1), n - 1)
    parent = [0] * (n + 1)
    for k in range(1, n):
        parent[numero[k]] = numero[pere[k]]
    return parent[2:]


def aleatoire(n, largeur=10 ** 9):
    return melange(n, [-1] + [random.randint(max(0, k - largeur), k - 1) for k in range(1, n)])


def araignee(bras, longueurs):
    # Un centre (créé en premier) et des bras de longueurs données.
    pere = [-1]
    for lg in longueurs[:bras]:
        precedent = 0
        for _ in range(lg):
            pere.append(precedent)
            precedent = len(pere) - 1
    return melange(len(pere), pere)


def fmt(parent):
    return f"{len(parent) + 1}\n" + " ".join(map(str, parent)) + "\n"


tests = [
    fmt([1, 2, 1, 4, 1, 6, 1]),
    fmt([1, 2, 3, 4, 5, 4, 2]),
]
tests.append(fmt([]))
tests.append(fmt([1]))
tests.append(fmt([1, 1, 1, 1, 1]))                                # étoile : tout le monde
tests.append(fmt([3, 4, 5, 6, 7, 8, 1]))                          # chemin, numéros désordonnés
tests.append(fmt(araignee(4, [3, 3, 2, 3])))
tests.append(fmt(melange(31, [-1] + [(k - 1) // 2 for k in range(1, 31)])))   # arbre binaire complet
tests.append(fmt(aleatoire(40, 3)))
tests.append(fmt(aleatoire(2000)))
# Grands cas.
tests.append(fmt(aleatoire(20000)))
tests.append(fmt(aleatoire(20000, 4)))
tests.append(fmt(araignee(40, [499] * 20 + [random.randint(1, 498) for _ in range(20)])))
# Deux bras très longs de longueurs différentes, et des milliers de petites branches.
pere = [-1]
for lg in (5000, 4999):
    precedent = 0
    for _ in range(lg):
        pere.append(precedent)
        precedent = len(pere) - 1
while len(pere) < 15000:
    pere.append(random.randrange(len(pere)))
tests.append(fmt(melange(len(pere), pere)))
print(json.dumps(tests))
