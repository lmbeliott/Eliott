import sys
import heapq


def cout_minimal(n, d, touches):
    # Dijkstra en partant de N : le sommet v signifie « il reste à fabriquer v ».
    dist = {n: 0}
    tas = [(0, n)]
    while tas:
        c, v = heapq.heappop(tas)
        if c > dist[v]:
            continue
        if v == 0:
            return c
        candidats = [(0, v * d)]  # fabriquer v uniquement avec des « + 1 »
        for m, cm in touches:
            q = v // m
            # dernière multiplication appliquée à q (on complète par des « + 1 ») ou à q + 1 (des « − 1 »)
            candidats.append((q, cm + d * (v - m * q)))
            if v % m != 0 and q + 1 < v:
                candidats.append((q + 1, cm + d * (m * (q + 1) - v)))
        for u, l in candidats:
            if c + l < dist.get(u, c + l + 1):
                dist[u] = c + l
                heapq.heappush(tas, (c + l, u))


donnees = sys.stdin.read().split()
t = int(donnees[0])
pos = 1
sortie = []
for _ in range(t):
    n, d, k = int(donnees[pos]), int(donnees[pos + 1]), int(donnees[pos + 2])
    touches = [(int(donnees[pos + 3 + 2 * i]), int(donnees[pos + 4 + 2 * i])) for i in range(k)]
    pos += 3 + 2 * k
    sortie.append(str(cout_minimal(n, d, touches)))
print("\n".join(sortie))
