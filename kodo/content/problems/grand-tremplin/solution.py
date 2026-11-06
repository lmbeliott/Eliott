n = int(input())
sauts = list(map(int, input().split()))

# Position du meilleur saut vu jusqu'ici : au départ, le premier sauteur.
meilleur = 0
for i in range(1, n):
    # Strictement plus loin : en cas d'égalité, le premier garde sa place.
    if sauts[i] > sauts[meilleur]:
        meilleur = i

# Les positions commencent à 0, les dossards à 1.
print(meilleur + 1, sauts[meilleur])
