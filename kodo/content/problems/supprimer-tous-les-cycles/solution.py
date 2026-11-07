import sys

donnees = sys.stdin.read().split()
n, m = int(donnees[0]), int(donnees[1])
voisins = [[] for _ in range(n + 1)]
for i in range(m):
    a = int(donnees[2 + 2 * i])
    b = int(donnees[3 + 2 * i])
    voisins[a].append(b)
    voisins[b].append(a)

# nombre de composantes connexes
vu = [False] * (n + 1)
composantes = 0
for depart in range(1, n + 1):
    if vu[depart]:
        continue
    composantes += 1
    vu[depart] = True
    pile = [depart]
    while pile:
        u = pile.pop()
        for v in voisins[u]:
            if not vu[v]:
                vu[v] = True
                pile.append(v)

# une forêt à c composantes a exactement n - c arêtes
print(m - n + composantes)
