import sys
import heapq

INFINI = 10 ** 18


def main():
    donnees = sys.stdin.buffer.read().split()
    n, m = int(donnees[0]), int(donnees[1])
    voisins = [[] for _ in range(n + 1)]
    pos = 2
    for _ in range(m):
        a, b, l = int(donnees[pos]), int(donnees[pos + 1]), int(donnees[pos + 2])
        pos += 3
        voisins[a].append((b, l))
        voisins[b].append((a, l))

    # Dijkstra depuis le sommet 1, avec suppression paresseuse
    dist = [INFINI] * (n + 1)
    dist[1] = 0
    tas = [(0, 1)]
    while tas:
        d, u = heapq.heappop(tas)
        if d > dist[u]:
            continue  # entrée périmée : u a déjà été traité avec une distance plus petite
        for v, l in voisins[u]:
            if d + l < dist[v]:
                dist[v] = d + l
                heapq.heappush(tas, (dist[v], v))

    print(" ".join(str(x) if x < INFINI else "-1" for x in dist[1:]))


main()
