import json, random
random.seed(2026)

N_MAX = 10000
K_MAX = 150


def fmt(k, w, parents):
    return f"{len(w)} {k}\n" + " ".join(map(str, w)) + "\n" + " ".join(map(str, parents)) + "\n"


def poids(n, wmin, wmax):
    return [random.randint(wmin, wmax) for _ in range(n)]


def arbre_aleatoire(n, portee):
    # Le parent de i est choisi parmi les « portee » sommets précédents (petite portée = arbre profond)
    return [random.randint(max(1, i - portee), i - 1) for i in range(2, n + 1)]


def optimum(k, w, parents):
    n = len(w)
    voisins = [[] for _ in range(n)]
    for i, p in enumerate(parents, start=1):
        voisins[i].append(p - 1)
        voisins[p - 1].append(i)
    best = None
    for m in range(1 << n):
        if bin(m).count("1") != k:
            continue
        vs = [i for i in range(n) if m >> i & 1]
        vus, pile = {vs[0]}, [vs[0]]
        while pile:
            u = pile.pop()
            for x in voisins[u]:
                if m >> x & 1 and x not in vus:
                    vus.add(x)
                    pile.append(x)
        if len(vus) == k:
            s = sum(w[i] for i in vs)
            best = s if best is None else max(best, s)
    return best, voisins


def glouton(k, w, voisins):
    # Part du sommet le plus lourd et ajoute toujours le voisin le plus lourd
    n = len(w)
    debut = max(range(n), key=lambda v: w[v])
    pris = {debut}
    total = w[debut]
    while len(pris) < k:
        bord = [x for u in pris for x in voisins[u] if x not in pris]
        x = max(bord, key=lambda v: w[v])
        pris.add(x)
        total += w[x]
    return total


def piege(n, k):
    while True:
        w = poids(n, -9, 9)
        parents = arbre_aleatoire(n, 3)
        best, voisins = optimum(k, w, parents)
        if glouton(k, w, voisins) < best:
            return fmt(k, w, parents)


tests = [
    fmt(3, [-2, 4, 5, -1, 3, 2, -4], [1, 1, 2, 2, 3, 3]),
    fmt(4, [3, -5, 4, 4, -1], [1, 2, 3, 4]),
]
# Cas limites : un seul sommet, K = N, K = 1, que des poids négatifs
tests.append(fmt(1, [-7], []))
tests.append(fmt(5, [2, -3, 4, -1, 6], [1, 1, 2, 3]))
tests.append(fmt(1, [5, -2, 9, 9, 1, 0], [1, 2, 2, 1, 5]))
tests.append(fmt(3, [-5, -1, -8, -2, -3, -9], [1, 1, 2, 2, 3]))
# Pièges pour le glouton « partir du plus lourd et ajouter le meilleur voisin »
tests.append(piege(10, 4))
tests.append(piege(12, 6))
tests.append(fmt(20, poids(200, -1000, 1000), arbre_aleatoire(200, 200)))
# Grands cas : chemin, arbre profond, arbre binaire, étoile de chemins.
# Le chemin fait échouer une fusion qui ne limite pas les tailles à K (environ N²/2 opérations).
tests.append(fmt(K_MAX, poids(N_MAX, -1000, 1000), [i - 1 for i in range(2, N_MAX + 1)]))
tests.append(fmt(K_MAX, poids(N_MAX, -1000, 1000), arbre_aleatoire(N_MAX, 5)))
tests.append(fmt(K_MAX, poids(5000, -1000, 1000), [i // 2 for i in range(2, 5001)]))
etoile = [1 if i % 40 == 2 else i - 1 for i in range(2, 5001)]
tests.append(fmt(K_MAX - 17, poids(5000, -1000, 800), etoile))
tests.append(fmt(60, poids(2000, -1000, 1000), arbre_aleatoire(2000, 2000)))
print(json.dumps(tests))
