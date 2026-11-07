import sys
import heapq

INFINI = 10 ** 18


def main():
    donnees = sys.stdin.buffer.read().split()
    n, m, k = int(donnees[0]), int(donnees[1]), int(donnees[2])
    marques = [int(x) for x in donnees[3:3 + k]]
    voisins = [[] for _ in range(n + 1)]
    aretes = []
    pos = 3 + k
    for _ in range(m):
        a, b, l = int(donnees[pos]), int(donnees[pos + 1]), int(donnees[pos + 2])
        pos += 3
        voisins[a].append((b, l))
        voisins[b].append((a, l))
        aretes.append((a, b, l))

    # Dijkstra à sources multiples : dist[v] = distance au sommet marqué le plus proche,
    # origine[v] = ce sommet marqué
    dist = [INFINI] * (n + 1)
    origine = [0] * (n + 1)
    tas = []
    for s in marques:
        dist[s] = 0
        origine[s] = s
        tas.append((0, s))
    heapq.heapify(tas)
    while tas:
        d, u = heapq.heappop(tas)
        if d > dist[u]:
            continue
        for v, l in voisins[u]:
            if d + l < dist[v]:
                dist[v] = d + l
                origine[v] = origine[u]
                heapq.heappush(tas, (dist[v], v))

    # une arête dont les extrémités ont des origines différentes donne un chemin entre deux sommets marqués
    meilleur = INFINI
    for a, b, l in aretes:
        if dist[a] < INFINI and dist[b] < INFINI and origine[a] != origine[b]:
            meilleur = min(meilleur, dist[a] + l + dist[b])
    print(meilleur if meilleur < INFINI else -1)


main()
