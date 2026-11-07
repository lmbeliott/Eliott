n = int(input())
a = list(map(int, input().split()))

# Pour chaque valeur : sa première position, sa dernière position, ses positions.
premiere = {}
derniere = {}
positions = {}
for i in range(n):
    v = a[i]
    if v not in premiere:
        premiere[v] = i
        positions[v] = []
    derniere[v] = i
    positions[v].append(i)

# Les éléments jamais déplacés restent devant, dans leur ordre : ce sont toutes les copies
# des plus petites valeurs, puis éventuellement une partie des copies de la valeur suivante.
gardes = 0
fin = -1        # dernière position des éléments gardés jusqu'ici
for v in sorted(premiere):
    if premiere[v] > fin:
        # toutes les copies de v sont après les éléments gardés : on les garde toutes
        gardes += len(positions[v])
        fin = derniere[v]
    else:
        # seules les copies de v placées après les éléments gardés peuvent rester
        for p in positions[v]:
            if p > fin:
                gardes += 1
        break

print(n - gardes)
