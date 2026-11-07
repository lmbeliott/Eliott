import sys
import heapq
from itertools import permutations

INFINI = 10 ** 18


def main():
    donnees = sys.stdin.buffer.read().split()
    n, m, k = int(donnees[0]), int(donnees[1]), int(donnees[2])
    imposes = [int(x) for x in donnees[3:3 + k]]
    voisins = [[] for _ in range(n + 1)]
    pos = 3 + k
    for _ in range(m):
        a, b, l = int(donnees[pos]), int(donnees[pos + 1]), int(donnees[pos + 2])
        pos += 3
        voisins[a].append((b, l))
        voisins[b].append((a, l))

    def dijkstra(source):
        dist = [INFINI] * (n + 1)
        dist[source] = 0
        tas = [(0, source)]
        while tas:
            d, u = heapq.heappop(tas)
            if d > dist[u]:
                continue
            for v, l in voisins[u]:
                if d + l < dist[v]:
                    dist[v] = d + l
                    heapq.heappush(tas, (dist[v], v))
        return dist

    # distances depuis le départ et depuis chaque sommet imposé : K + 1 exécutions de Dijkstra
    depuis_depart = dijkstra(1)
    depuis = [dijkstra(s) for s in imposes]

    meilleur = INFINI
    for ordre in permutations(range(k)):  # on essaie tous les ordres de visite
        total = depuis_depart[imposes[ordre[0]]] if k > 0 else depuis_depart[n]
        for i in range(k - 1):
            total += depuis[ordre[i]][imposes[ordre[i + 1]]]
        if k > 0:
            total += depuis[ordre[-1]][n]
        meilleur = min(meilleur, total)
    print(meilleur if meilleur < INFINI else -1)


main()
