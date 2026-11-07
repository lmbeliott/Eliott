import sys
from collections import deque


def main():
    donnees = sys.stdin.buffer.read().split()
    n, m = int(donnees[0]), int(donnees[1])
    voisins = [[] for _ in range(n + 1)]
    pos = 2
    for _ in range(m):
        a, b = int(donnees[pos]), int(donnees[pos + 1])
        pos += 2
        voisins[a].append(b)
        voisins[b].append(a)

    # Parcours en largeur sur les états (sommet, parité de la longueur) :
    # dist[p][v] = longueur minimale d'une marche de 1 à v dont la longueur a la parité p.
    INF = -1
    dist = [[INF] * (n + 1), [INF] * (n + 1)]
    dist[0][1] = 0
    file = deque([(1, 0)])
    while file:
        u, p = file.popleft()
        for v in voisins[u]:
            if dist[1 - p][v] == INF:
                dist[1 - p][v] = dist[p][u] + 1
                file.append((v, 1 - p))

    q = int(donnees[pos])
    pos += 1
    reponses = []
    for _ in range(q):
        v, k = int(donnees[pos]), int(donnees[pos + 1])
        pos += 2
        d = dist[k % 2][v]
        # Une marche de longueur d se prolonge de 2 en faisant un aller-retour sur une arête,
        # à condition qu'il y ait une arête : le sommet 1 ne doit pas être isolé.
        if d != INF and d <= k and (k == d or voisins[1]):
            reponses.append("OUI")
        else:
            reponses.append("NON")
    print("\n".join(reponses))


main()
