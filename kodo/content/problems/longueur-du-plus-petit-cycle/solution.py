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

meilleur = n + 1                    # aucun cycle ne dépasse n arêtes
for s in range(1, n + 1):
    # parcours en largeur depuis s
    dist = [-1] * (n + 1)
    parent = [0] * (n + 1)
    dist[s] = 0
    file = deque([s])
    while file:
        u = file.popleft()
        for v in voisins[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + 1
                parent[v] = u
                file.append(v)
            elif v != parent[u]:
                # arête hors de l'arbre : un cycle d'au plus dist[u] + dist[v] + 1 arêtes
                meilleur = min(meilleur, dist[u] + dist[v] + 1)
print(meilleur if meilleur <= n else -1)
