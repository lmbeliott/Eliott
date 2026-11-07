import sys
from collections import deque

donnees = sys.stdin.read().split()
n, m = int(donnees[0]), int(donnees[1])
voisins = [[] for _ in range(n + 1)]
for i in range(m):
    a = int(donnees[2 + 2 * i])
    b = int(donnees[3 + 2 * i])
    voisins[a].append(b)
    voisins[b].append(a)

dist = [-1] * (n + 1)
dist[1] = 0
restants = list(range(2, n + 1))    # sommets pas encore découverts
marque = [False] * (n + 1)
file = deque([1])
while file:
    u = file.popleft()
    for v in voisins[u]:
        marque[v] = True
    garde = []
    for v in restants:
        if marque[v]:
            garde.append(v)         # voisin de u dans G : pas voisin dans le complémentaire
        else:
            dist[v] = dist[u] + 1
            file.append(v)
    restants = garde
    for v in voisins[u]:
        marque[v] = False
print(*dist[1:])
