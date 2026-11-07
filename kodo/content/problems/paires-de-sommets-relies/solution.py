import sys

donnees = sys.stdin.read().split()
n, m = int(donnees[0]), int(donnees[1])
voisins = [[] for _ in range(n + 1)]
for i in range(m):
    a = int(donnees[2 + 2 * i])
    b = int(donnees[3 + 2 * i])
    voisins[a].append(b)
    voisins[b].append(a)

vu = [False] * (n + 1)
paires = 0
for depart in range(1, n + 1):
    if vu[depart]:
        continue
    # parcours en profondeur avec une pile : taille de la composante
    vu[depart] = True
    pile = [depart]
    taille = 0
    while pile:
        u = pile.pop()
        taille += 1
        for v in voisins[u]:
            if not vu[v]:
                vu[v] = True
                pile.append(v)
    paires += taille * (taille - 1) // 2
print(paires)
