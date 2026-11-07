n = int(input())
t = list(map(int, input().split()))

courant = t[0]          # meilleur total d'une période qui finit au jour courant
debut = 0               # premier jour de cette période (indice)
meilleur = t[0]
meilleur_debut = 0
meilleur_fin = 0
for i in range(1, n):
    if courant >= 0:
        courant = courant + t[i]   # prolonger la période
    else:
        courant = t[i]             # repartir de zéro
        debut = i
    if courant > meilleur:         # strict : on garde la première trouvée
        meilleur = courant
        meilleur_debut = debut
        meilleur_fin = i
print(meilleur, meilleur_debut + 1, meilleur_fin + 1)
