import json, random
random.seed(2026)

N_MAX = 15000


def fmt(w, parents):
    return f"{len(w)}\n" + " ".join(map(str, w)) + "\n" + " ".join(map(str, parents)) + "\n"


def poids(n, wmax):
    return [random.randint(1, wmax) for _ in range(n)]


def arbre_aleatoire(n, portee):
    # Le parent de i est choisi parmi les « portee » sommets précédents (petite portée = arbre profond)
    return [random.randint(max(1, i - portee), i - 1) for i in range(2, n + 1)]


tests = [
    fmt([4, 3, 5, 2, 6, 1], [1, 1, 2, 3, 3]),
    fmt([2, 7, 2, 2, 7], [1, 2, 3, 4]),
]
# Cas limites : un sommet, deux sommets, une étoile
tests.append(fmt([5], []))
tests.append(fmt([3, 8], [1]))
tests.append(fmt([1, 5, 6, 7, 8], [1, 1, 1, 1]))
# Le centre lourd d'une étoile contre les feuilles : il vaut mieux prendre le centre seul ou une feuille
tests.append(fmt([10, 9, 9, 9, 9], [1, 1, 1, 1]))


def distances(n, parents):
    voisins = [[] for _ in range(n + 1)]
    for i, p in enumerate(parents, start=2):
        voisins[i].append(p)
        voisins[p].append(i)
    dist = []
    for s in range(n + 1):
        d = [-1] * (n + 1)
        if s:
            d[s] = 0
            file = [s]
            for u in file:
                for x in voisins[u]:
                    if d[x] < 0:
                        d[x] = d[u] + 1
                        file.append(x)
        dist.append(d)
    return dist


def optimum(w, parents, dist):
    n = len(w)
    best = 0
    for m in range(1 << n):
        vs = [i + 1 for i in range(n) if m >> i & 1]
        if all(dist[a][b] >= 3 for k, a in enumerate(vs) for b in vs[k + 1:]):
            best = max(best, sum(w[i - 1] for i in vs))
    return best


def glouton(w, dist):
    # Prend les sommets du plus lourd au plus léger, quand c'est encore permis
    choisis = []
    for v in sorted(range(1, len(w) + 1), key=lambda v: -w[v - 1]):
        if all(dist[v][u] >= 3 for u in choisis):
            choisis.append(v)
    return sum(w[v - 1] for v in choisis)


def piege(n):
    while True:
        w = poids(n, 9)
        parents = arbre_aleatoire(n, 2)
        dist = distances(n, parents)
        if glouton(w, dist) < optimum(w, parents, dist):
            return fmt(w, parents)


# Pièges pour « prendre le plus lourd d'abord »
tests.append(piege(8))
tests.append(piege(11))
tests.append(fmt(poids(12, 9), arbre_aleatoire(12, 3)))
tests.append(fmt(poids(300, 100), arbre_aleatoire(300, 300)))
# Grands cas : arbre aléatoire, arbre très profond, chenille (un long chemin avec des pattes)
tests.append(fmt(poids(N_MAX, 1000), arbre_aleatoire(N_MAX, N_MAX)))
tests.append(fmt(poids(10000, 1000), arbre_aleatoire(10000, 3)))
chenille = [i - 1 if i % 3 != 0 else i - 1 - random.randint(0, 1) for i in range(2, 8001)]
tests.append(fmt(poids(8000, 1000), [max(1, p) for p in chenille]))
tests.append(fmt([1000] * 4000, [i - 1 for i in range(2, 4001)]))
print(json.dumps(tests))
