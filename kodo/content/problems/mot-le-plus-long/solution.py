n = int(input())
mots = input().split()
meilleur = mots[0]
for m in mots:
    if len(m) > len(meilleur):     # > strict : on garde le premier en cas d'égalité
        meilleur = m
print(meilleur, len(meilleur))
