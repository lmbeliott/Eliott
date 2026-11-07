import sys
import heapq

INFINI = 10 ** 18


def dijkstra(n, voisins, depart):
    # dist[v] = longueur d'un plus court chemin de depart à v.
    dist = [INFINI] * (n + 1)
    dist[depart] = 0
    tas = [(0, depart)]
    while tas:
        d, u = heapq.heappop(tas)
        if d > dist[u]:
            continue  # entrée périmée
        for v, t in voisins[u]:
            if d + t < dist[v]:
                dist[v] = d + t
                heapq.heappush(tas, (d + t, v))
    return dist


def main():
    donnees = sys.stdin.buffer.read().split()
    n, m = int(donnees[0]), int(donnees[1])
    aretes = []
    voisins = [[] for _ in range(n + 1)]
    pos = 2
    for _ in range(m):
        a, b, t = int(donnees[pos]), int(donnees[pos + 1]), int(donnees[pos + 2])
        pos += 3
        aretes.append((a, b, t))
        voisins[a].append((b, t))
        voisins[b].append((a, t))

    depuis1 = dijkstra(n, voisins, 1)
    depuisN = dijkstra(n, voisins, n)
    total = depuis1[n]

    compte = 0
    if total < INFINI:
        for a, b, t in aretes:
            # L'arête peut être parcourue dans les deux sens.
            if depuis1[a] + t + depuisN[b] == total or depuis1[b] + t + depuisN[a] == total:
                compte += 1
    print(compte)


main()
