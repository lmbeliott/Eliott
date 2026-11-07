import sys
import heapq

INF = 1 << 60


def main():
    donnees = sys.stdin.buffer.read().split()
    n, m, k = int(donnees[0]), int(donnees[1]), int(donnees[2])
    imposes = [int(x) - 1 for x in donnees[3:3 + k]]
    voisins = [[] for _ in range(n)]
    pos = 3 + k
    for _ in range(m):
        u, v, c = int(donnees[pos]) - 1, int(donnees[pos + 1]) - 1, int(donnees[pos + 2])
        pos += 3
        voisins[u].append((v, c))
        voisins[v].append((u, c))

    # cout[masque][v] : coût minimal d'un ensemble d'arêtes qui relie v
    # et tous les sommets imposés du masque
    tout = (1 << k) - 1
    cout = [None] * (tout + 1)
    for masque in range(1, tout + 1):
        actuel = [INF] * n
        if masque & (masque - 1) == 0:
            # un seul sommet imposé
            actuel[imposes[masque.bit_length() - 1]] = 0
        else:
            # Deux arbres qui se rejoignent en v : on coupe le masque en deux parties non vides.
            # La partie s contient le plus petit bit du masque, pour ne voir chaque coupe qu'une fois.
            bas = masque & -masque
            s = (masque - 1) & masque
            while s:
                if s & bas:
                    a, b = cout[s], cout[masque ^ s]
                    actuel = [min(x, y + z) for x, y, z in zip(actuel, a, b)]
                s = (s - 1) & masque
        # Puis on prolonge depuis v par un chemin : Dijkstra qui part de tous les sommets à la fois.
        tas = [(d, v) for v, d in enumerate(actuel) if d < INF]
        heapq.heapify(tas)
        while tas:
            d, u = heapq.heappop(tas)
            if d > actuel[u]:
                continue
            for v, c in voisins[u]:
                if d + c < actuel[v]:
                    actuel[v] = d + c
                    heapq.heappush(tas, (d + c, v))
        cout[masque] = actuel
    print(cout[tout][imposes[0]])


main()
