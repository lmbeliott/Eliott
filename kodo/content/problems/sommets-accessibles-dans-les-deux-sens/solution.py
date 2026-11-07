import sys
from collections import deque

def accessibles(voisins, n):
    # parcours en largeur depuis le sommet 1 ; renvoie le tableau des sommets marqués
    vu = [False] * (n + 1)
    vu[1] = True
    file = deque([1])
    while file:
        u = file.popleft()
        for v in voisins[u]:
            if not vu[v]:
                vu[v] = True
                file.append(v)
    return vu

donnees = sys.stdin.read().split()
n, m = int(donnees[0]), int(donnees[1])
avant = [[] for _ in range(n + 1)]     # arcs dans leur sens
arriere = [[] for _ in range(n + 1)]   # arcs retournés
for i in range(m):
    a = int(donnees[2 + 2 * i])
    b = int(donnees[3 + 2 * i])
    avant[a].append(b)
    arriere[b].append(a)

depuis1 = accessibles(avant, n)
vers1 = accessibles(arriere, n)
deux = sum(1 for v in range(1, n + 1) if depuis1[v] and vers1[v])
print(sum(depuis1), sum(vers1), deux)
