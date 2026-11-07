n = int(input())
notes = list(map(int, input().split()))

cpt = [0] * 21          # cpt[v] = nombre de copies notées v
for v in notes:
    cpt[v] = cpt[v] + 1

resultat = []
for v in range(21):     # les valeurs dans l'ordre croissant
    for _ in range(cpt[v]):
        resultat.append(v)
print(*resultat)
