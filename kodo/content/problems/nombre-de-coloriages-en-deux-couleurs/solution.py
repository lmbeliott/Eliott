import sys
from collections import deque

MOD = 1000000007
donnees = sys.stdin.read().split()
n, m = int(donnees[0]), int(donnees[1])
voisins = [[] for _ in range(n + 1)]
for i in range(m):
    a = int(donnees[2 + 2 * i])
    b = int(donnees[3 + 2 * i])
    voisins[a].append(b)
    voisins[b].append(a)

couleur = [-1] * (n + 1)
reponse = 1
for depart in range(1, n + 1):
    if couleur[depart] != -1:
        continue
    reponse = reponse * 2 % MOD     # nouvelle composante : deux choix
    couleur[depart] = 0
    file = deque([depart])
    while file:
        u = file.popleft()
        for v in voisins[u]:
            if couleur[v] == -1:
                couleur[v] = 1 - couleur[u]
                file.append(v)
            elif couleur[v] == couleur[u]:
                reponse = 0         # cycle impair (ou boucle)
print(reponse)
