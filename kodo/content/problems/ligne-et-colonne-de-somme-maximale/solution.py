n, m = map(int, input().split())
g = []
for i in range(n):
    g.append(list(map(int, input().split())))

# Ligne de plus grande somme (la première en cas d'égalité).
meilleure_ligne = -1
meilleure_somme = 0
for i in range(n):
    s = 0
    for j in range(m):
        s = s + g[i][j]
    if meilleure_ligne == -1 or s > meilleure_somme:
        meilleure_somme = s
        meilleure_ligne = i

# Colonne de plus grande somme : j fixé, i varie.
meilleure_colonne = -1
meilleure_somme = 0
for j in range(m):
    s = 0
    for i in range(n):
        s = s + g[i][j]
    if meilleure_colonne == -1 or s > meilleure_somme:
        meilleure_somme = s
        meilleure_colonne = j

print(meilleure_ligne + 1)
print(meilleure_colonne + 1)
