import sys
import heapq

INFINI = 10 ** 18


def main():
    donnees = sys.stdin.buffer.read().split()
    n, m = int(donnees[0]), int(donnees[1])
    cout_sommet = [0] + [int(x) for x in donnees[2:2 + n]]
    cout_sommet[n] = 0  # le sommet d'arrivée ne coûte rien

    voisins = [[] for _ in range(n + 1)]
    pos = 2 + n
    for _ in range(m):
        a, b, t = int(donnees[pos]), int(donnees[pos + 1]), int(donnees[pos + 2])
        pos += 3
        voisins[a].append((b, t))
        voisins[b].append((a, t))

    # Dijkstra : entrer dans v par une arête de longueur t coûte t + cout_sommet[v].
    dist = [INFINI] * (n + 1)
    dist[1] = 0
    tas = [(0, 1)]
    while tas:
        d, u = heapq.heappop(tas)
        if d > dist[u]:
            continue  # entrée périmée
        if u == n:
            break  # la distance de N est définitive
        for v, t in voisins[u]:
            nd = d + t + cout_sommet[v]
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(tas, (nd, v))

    print(dist[n] if dist[n] < INFINI else -1)


main()
