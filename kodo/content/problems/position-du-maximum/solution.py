n = int(input())
scores = list(map(int, input().split()))

# Position du meilleur score vu jusqu'ici : au départ, le premier candidat.
meilleur = 0
for i in range(1, n):
    # Strictement plus grand : en cas d'égalité, le premier garde sa place.
    if scores[i] > scores[meilleur]:
        meilleur = i

# Les positions commencent à 0, les numéros à 1.
print(meilleur + 1, scores[meilleur])
