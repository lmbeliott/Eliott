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

# parcours en largeur depuis le sommet 1
dist = [-1] * (n + 1)
dist[1] = 0
file = deque([1])
while file:
    u = file.popleft()
    for v in voisins[u]:
        if dist[v] == -1:
            dist[v] = dist[u] + 1
            file.append(v)

dmax = max(dist[1:])
compte = [0] * (dmax + 1)
inaccessibles = 0
for v in range(1, n + 1):
    if dist[v] == -1:
        inaccessibles += 1
    else:
        compte[dist[v]] += 1
print(*compte)
print(inaccessibles)
