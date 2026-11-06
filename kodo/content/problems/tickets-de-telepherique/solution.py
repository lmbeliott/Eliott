import sys
import heapq

INFINI = 10 ** 18


def main():
    donnees = sys.stdin.buffer.read().split()
    n, m, k_max = int(donnees[0]), int(donnees[1]), int(donnees[2])
    voisins = [[] for _ in range(n + 1)]  # (gare voisine, durée, 1 si téléphérique)
    for i in range(m):
        a, b, t, c = (int(x) for x in donnees[3 + 4 * i:7 + 4 * i])
        voisins[a].append((b, t, c))
        voisins[b].append((a, t, c))

    # dist[u][k] = durée minimale pour être à la gare u après avoir utilisé k tickets.
    dist = [[INFINI] * (k_max + 1) for _ in range(n + 1)]
    dist[1][0] = 0
    tas = [(0, 1, 0)]
    while tas:
        d, u, k = heapq.heappop(tas)
        if d > dist[u][k]:
            continue  # entrée périmée
        if u == n:
            print(d)  # premier état (N, k) retiré : c'est le plus rapide
            return
        for v, t, c in voisins[u]:
            k2 = k + c  # un téléphérique consomme un ticket
            if k2 <= k_max and d + t < dist[v][k2]:
                dist[v][k2] = d + t
                heapq.heappush(tas, (d + t, v, k2))

    print(-1)


main()
