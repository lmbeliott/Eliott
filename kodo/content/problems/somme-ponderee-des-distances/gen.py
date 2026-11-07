import json, random
random.seed(2026)


def arbre(n, forme, largeur=10 ** 9):
    # Renvoie parent[2..N] d'un arbre de racine 1. Le sommet créé en k-ième position a pour
    # parent un sommet créé avant lui ; les numéros sont ensuite mélangés (la racine reste 1).
    pere = [-1]
    for k in range(1, n):
        if forme == 'chemin':
            pere.append(k - 1)
        elif forme == 'etoile':
            pere.append(0)
        else:
            pere.append(random.randint(max(0, k - largeur), k - 1))
    numero = [1] + random.sample(range(2, n + 1), n - 1)
    parent = [0] * (n + 1)
    for k in range(1, n):
        parent[numero[k]] = numero[pere[k]]
    return parent[2:]


def fmt(c, parent):
    return f"{len(c)}\n" + " ".join(map(str, c)) + "\n" + " ".join(map(str, parent)) + "\n"


tests = [
    fmt([2, 0, 1, 3, 1], [1, 1, 3, 3]),
    fmt([1, 1, 1, 1], [3, 1, 2]),
]
tests.append(fmt([7], []))
tests.append(fmt([0, 0, 0, 0, 0, 0], [1, 2, 2, 4, 1]))               # aucun poids
tests.append(fmt([0, 0, 0, 0, 9, 0], [1, 2, 2, 4, 1]))               # un seul sommet pèse
tests.append(fmt([1000, 0, 0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1, 1]))
tests.append(fmt([random.randint(0, 9) for _ in range(15)], arbre(15, 'aleatoire', 3)))
tests.append(fmt([random.randint(0, 1000) for _ in range(300)], arbre(300, 'aleatoire')))
# Grands cas.
tests.append(fmt([random.randint(0, 1000) for _ in range(12000)], arbre(12000, 'aleatoire')))
tests.append(fmt([1000] * 12000, arbre(12000, 'chemin')))             # sommes au-delà de 2³¹
tests.append(fmt([random.choice([0, 0, 0, 1000]) for _ in range(8000)], arbre(8000, 'aleatoire', 3)))
tests.append(fmt([random.randint(0, 1000) for _ in range(3000)], arbre(3000, 'etoile')))
tests.append(fmt([random.randint(0, 1000) for _ in range(6000)], arbre(6000, 'aleatoire', 5)))
print(json.dumps(tests))
