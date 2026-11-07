n = int(input())
valeurs = list(map(int, input().split()))
vues = set()
i = 0
# on avance tant que la valeur lue n'a jamais été vue
while i < n and valeurs[i] not in vues:
    vues.add(valeurs[i])
    i = i + 1
if i < n:
    print(valeurs[i], i + 1)        # position comptée à partir de 1
else:
    print("AUCUNE")
