n = int(input())
nombres = list(map(int, input().split()))

# compte[v] = nombre d'apparitions de la valeur v.
compte = {}
for v in nombres:
    if v not in compte:
        compte[v] = 0
    compte[v] += 1

# On garde les valeurs vues au moins deux fois, de la plus petite à la plus grande.
doubles = []
for v in sorted(compte):
    if compte[v] >= 2:
        doubles.append(v)

print(len(doubles))
for v in doubles:
    print(v, compte[v])
