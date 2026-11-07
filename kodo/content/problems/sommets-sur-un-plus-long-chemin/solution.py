import sys


def parcours(voisins, sources):
    # Parcours en largeur depuis plusieurs sources : renvoie l'ordre de visite,
    # la distance à la source la plus proche et le parent de chaque sommet.
    n = len(voisins) - 1
    dist = [-1] * (n + 1)
    parent = [0] * (n + 1)
    for s in sources:
        dist[s] = 0
    ordre = list(sources)
    for u in ordre:
        for v in voisins[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + 1
                parent[v] = u
                ordre.append(v)
    return ordre, dist, parent


def main():
    donnees = sys.stdin.buffer.read().split()
    n = int(donnees[0])
    voisins = [[] for _ in range(n + 1)]
    for v in range(2, n + 1):
        p = int(donnees[v - 1])
        voisins[v].append(p)
        voisins[p].append(v)

    # Diamètre : le sommet a le plus loin de 1, puis le sommet b le plus loin de a.
    ordre, dist, _ = parcours(voisins, [1])
    a = ordre[-1]
    ordre, dist, parent = parcours(voisins, [a])
    b = ordre[-1]
    d = dist[b]
    chemin = [b]  # le chemin de b à a
    while chemin[-1] != a:
        chemin.append(parent[chemin[-1]])

    # Tous les plus longs chemins passent par le centre (un sommet si d est pair, deux sinon).
    if d % 2 == 0:
        centres = [chemin[d // 2]]
    else:
        centres = [chemin[d // 2], chemin[d // 2 + 1]]
    h = d // 2  # distance du centre à chaque bout d'un plus long chemin

    # Depuis le centre, v est sur un plus long chemin si son sous-arbre descend jusqu'à la distance h.
    ordre, dist, parent = parcours(voisins, centres)
    plus_bas = dist[:]  # plus_bas[v] = plus grande distance au centre dans le sous-arbre de v
    for v in reversed(ordre):
        if dist[v] > 0 and plus_bas[v] > plus_bas[parent[v]]:
            plus_bas[parent[v]] = plus_bas[v]
    print(sum(1 for v in range(1, n + 1) if plus_bas[v] == h))


main()
