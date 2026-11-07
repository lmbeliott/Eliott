import sys
import heapq

INFINI = 10 ** 18


def main():
    donnees = sys.stdin.buffer.read().split()
    n, m = int(donnees[0]), int(donnees[1])
    aretes = []
    voisins = [[] for _ in range(n + 1)]  # (voisin, longueur, numéro de l'arête)
    pos = 2
    for i in range(m):
        a, b, t = int(donnees[pos]), int(donnees[pos + 1]), int(donnees[pos + 2])
        pos += 3
        aretes.append((a, b, t))
        voisins[a].append((b, t, i))
        voisins[b].append((a, t, i))

    # Dijkstra depuis 1. Pour chaque sommet v, on retient l'arête par laquelle on l'atteint
    # (arrivee[v]) et la première arête du chemin depuis 1 (branche[v]).
    dist = [INFINI] * (n + 1)
    arrivee = [-1] * (n + 1)
    branche = [-1] * (n + 1)
    dist[1] = 0
    tas = [(0, 1)]
    while tas:
        d, u = heapq.heappop(tas)
        if d > dist[u]:
            continue  # entrée périmée
        for v, t, i in voisins[u]:
            if d + t < dist[v]:
                dist[v] = d + t
                arrivee[v] = i
                branche[v] = i if u == 1 else branche[u]
                heapq.heappush(tas, (d + t, v))

    meilleur = INFINI
    for i, (a, b, t) in enumerate(aretes):
        if dist[a] == INFINI or dist[b] == INFINI:
            continue
        if a == 1 or b == 1:
            v = b if a == 1 else a
            # Cette arête, puis le chemin de v vers 1 dans l'arbre, s'il ne la reprend pas.
            if arrivee[v] != i:
                meilleur = min(meilleur, t + dist[v])
        elif branche[a] != branche[b]:
            # Deux branches différentes : les deux chemins ne se touchent qu'en 1.
            meilleur = min(meilleur, dist[a] + t + dist[b])

    print(meilleur if meilleur < INFINI else -1)


main()
