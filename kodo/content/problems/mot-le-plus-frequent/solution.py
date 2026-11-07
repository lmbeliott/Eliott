n = int(input())
mots = input().split()

compte = {}
for m in mots:
    compte[m] = compte.get(m, 0) + 1

# on parcourt les mots dans l'ordre de l'entrée : en cas d'égalité,
# le mot apparu en premier est rencontré en premier et reste le meilleur
meilleur = mots[0]
for m in mots:
    if compte[m] > compte[meilleur]:
        meilleur = m
print(meilleur, compte[meilleur])
