import sys
import heapq

INFINI = 10 ** 18


def main():
    donnees = sys.stdin.buffer.read().split()
    n, m = int(donnees[0]), int(donnees[1])
    sortantes = [[] for _ in range(n + 1)]  # (arrivée, premier départ, période, durée)
    pos = 2
    for _ in range(m):
        a, b, f, p, t = (int(x) for x in donnees[pos:pos + 5])
        pos += 5
        sortantes[a].append((b, f, p, t))

    # arrivee[v] = date d'arrivée au plus tôt au sommet v.
    arrivee = [INFINI] * (n + 1)
    arrivee[1] = 0
    tas = [(0, 1)]
    while tas:
        d, u = heapq.heappop(tas)
        if d > arrivee[u]:
            continue  # entrée périmée
        if u == n:
            print(d)
            return
        for v, f, p, t in sortantes[u]:
            # Premier départ à une date >= d : f, f + p, f + 2p, ...
            if d <= f:
                depart = f
            else:
                depart = f + (d - f + p - 1) // p * p
            if depart + t < arrivee[v]:
                arrivee[v] = depart + t
                heapq.heappush(tas, (depart + t, v))

    print(-1)


main()
