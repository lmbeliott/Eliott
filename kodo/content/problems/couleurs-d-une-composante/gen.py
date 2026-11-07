import json, random
random.seed(2026)


def explicite(couleurs, aretes, requetes):
    lignes = [f"{len(couleurs)} {len(aretes)} {len(requetes)} 0", " ".join(map(str, couleurs))]
    lignes += [f"{u} {v} {w}" for u, v, w in aretes]
    lignes += [f"{v} {t}" for v, t in requetes]
    return "\n".join(lignes) + "\n"


def genere(n, m, q, graine, a, b, w, k):
    return f"{n} {m} {q} {graine}\n{a} {b} {w} {k}\n"


def aleatoire(n, m, q, kmax, wmax):
    couleurs = [random.randint(1, kmax) for _ in range(n)]
    aretes = [(random.randint(1, n), random.randint(1, n), random.randint(1, wmax)) for _ in range(m)]
    requetes = [(random.randint(1, n), random.randint(1, wmax)) for _ in range(q)]
    return explicite(couleurs, aretes, requetes)


tests = [
    explicite([1, 2, 1, 3, 2, 3], [(1, 2, 4), (2, 3, 1), (4, 5, 2), (3, 4, 7), (5, 6, 5)],
              [(1, 3), (1, 4), (4, 5), (6, 5), (6, 7), (2, 1)]),
    genere(6, 7, 5, 3, 6, 6, 9, 4),
]
# Cas limites : un sommet, aucune arête utile, boucles et arêtes multiples, poids égaux
tests.append(explicite([7], [(1, 1, 3)], [(1, 2), (1, 3)]))
tests.append(explicite([1, 1, 1], [(1, 2, 5), (2, 3, 5)], [(1, 4), (1, 5), (3, 5)]))
tests.append(explicite([1, 2, 3, 4], [(1, 2, 2), (1, 2, 1), (3, 3, 1), (2, 3, 2), (3, 4, 9)],
                       [(4, 8), (4, 9), (1, 1), (3, 2)]))
tests.append(aleatoire(12, 15, 20, 4, 10))
tests.append(aleatoire(300, 400, 300, 50, 1000))
# Grands tests produits par le générateur
N, M, Q = 50000, 100000, 100000
tests.append(genere(N, M, Q, 7, N, N, 10 ** 9, N))        # aléatoire, couleurs toutes différentes
tests.append(genere(N, M, Q, 9, 1, N, 10 ** 6, N))        # étoile : toutes les arêtes partent de 1
tests.append(genere(N, M, Q, 11, N, 1, 10 ** 6, N))       # étoile : toutes les arêtes arrivent en 1
tests.append(genere(N, M, Q, 13, N, N, 10, 3))            # trois couleurs, beaucoup de poids égaux
tests.append(genere(N, N // 2, Q, 17, N, N, 10 ** 6, 1000))  # beaucoup de petites composantes
tests.append(genere(N, M, Q, 19, 2, N, 10 ** 9, 40000))
print(json.dumps(tests))
