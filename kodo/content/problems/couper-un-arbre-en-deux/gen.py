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
        elif forme == 'chenille':
            pere.append(max(0, k - 2) if k % 2 == 1 else k - 1)  # une colonne, une feuille par sommet
        elif forme == 'binaire':
            pere.append((k - 1) // 2)
        else:
            pere.append(random.randint(max(0, k - largeur), k - 1))
    numero = [1] + random.sample(range(2, n + 1), n - 1)
    parent = [0] * (n + 1)
    for k in range(1, n):
        parent[numero[k]] = numero[pere[k]]
    return parent[2:]


def fmt(poids, parent):
    return f"{len(poids)}\n" + " ".join(map(str, poids)) + "\n" + " ".join(map(str, parent)) + "\n"


tests = [
    fmt([3, 1, 4, 1, 5, 9, 2], [1, 1, 2, 2, 3, 3]),
    fmt([2, 7, 1, 8, 2, 8], [3, 1, 3, 1, 4]),
]
tests.append(fmt([5, 5], [1]))
tests.append(fmt([1, 1000], [1]))
tests.append(fmt([4, 1, 1, 1, 1], [1, 1, 1, 1]))                 # étoile
tests.append(fmt([1] * 7, [1, 2, 3, 4, 5, 6]))                    # chemin impair : deux coupes à égalité
tests.append(fmt([1] * 10, arbre(10, 'chemin')))
tests.append(fmt([random.randint(1, 10) for _ in range(30)], arbre(30, 'aleatoire')))
tests.append(fmt([random.randint(1, 1000) for _ in range(500)], arbre(500, 'binaire')))
# Grands cas.
tests.append(fmt([random.randint(1, 1000) for _ in range(12000)], arbre(12000, 'aleatoire')))
tests.append(fmt([random.randint(1, 1000) for _ in range(12000)], arbre(12000, 'chemin')))
tests.append(fmt([1] * 12000, arbre(12000, 'chenille')))
tests.append(fmt([random.randint(1, 3) for _ in range(8000)], arbre(8000, 'aleatoire', largeur=5)))
print(json.dumps(tests))
