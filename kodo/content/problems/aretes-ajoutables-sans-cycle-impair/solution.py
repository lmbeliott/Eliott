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

couleur = [-1] * (n + 1)
biparti = True
entre = n * (n - 1) // 2        # paires de composantes différentes (on retire les autres)
opposees = 0                    # paires de couleurs différentes dans une même composante
for depart in range(1, n + 1):
    if couleur[depart] != -1:
        continue
    couleur[depart] = 0
    nb = [1, 0]                 # nombre de sommets de chaque couleur
    file = deque([depart])
    while file:
        u = file.popleft()
        for v in voisins[u]:
            if couleur[v] == -1:
                couleur[v] = 1 - couleur[u]
                nb[couleur[v]] += 1
                file.append(v)
            elif couleur[v] == couleur[u]:
                biparti = False
    s = nb[0] + nb[1]
    entre -= s * (s - 1) // 2
    opposees += nb[0] * nb[1]

if biparti:
    print(entre + opposees - m)
else:
    print(0)
