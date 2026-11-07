n = int(input())
l = list(map(int, input().split()))
l.sort()

triangles = 0
for k in range(2, n):            # l[k] est le plus grand côté
    g = 0
    d = k - 1
    while g < d:
        if l[g] + l[d] > l[k]:
            triangles = triangles + (d - g)   # toutes les paires (i, d) avec g <= i < d
            d = d - 1
        else:
            g = g + 1                         # g ne va avec aucun j restant
print(triangles)
