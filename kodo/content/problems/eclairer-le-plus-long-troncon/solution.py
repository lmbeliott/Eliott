import sys

donnees = sys.stdin.read().split()
l = int(donnees[0])
n = int(donnees[1])
k = int(donnees[2])

# étape 1 : tableau des différences, puis nombre de lampadaires par position
d = [0] * (l + 2)
for i in range(n):
    a = int(donnees[3 + 2 * i])
    b = int(donnees[4 + 2 * i])
    d[a] = d[a] + 1
    d[b + 1] = d[b + 1] - 1
sombre = [False] * (l + 1)
c = 0
for p in range(1, l + 1):
    c = c + d[p]
    sombre[p] = (c == 0)

# étape 2 : plus longue fenêtre avec au plus k positions sombres
g = 1
sombres = 0             # positions sombres dans la fenêtre [g, fin]
meilleure = 0
debut = 1
for fin in range(1, l + 1):
    if sombre[fin]:
        sombres = sombres + 1
    while sombres > k:
        if sombre[g]:
            sombres = sombres - 1
        g = g + 1
    if fin - g + 1 > meilleure:      # strictement plus longue : la plus à gauche
        meilleure = fin - g + 1
        debut = g
print(meilleure, debut)
