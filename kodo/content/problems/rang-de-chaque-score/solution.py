n = int(input())
scores = list(map(int, input().split()))

# Du meilleur score au moins bon.
tries = sorted(scores, reverse=True)

# rang[s] = 1 + nombre de scores strictement meilleurs que s :
# c'est la position (en comptant à partir de 1) de la première apparition de s dans la liste triée.
rang = {}
for i in range(n):
    if tries[i] not in rang:
        rang[tries[i]] = i + 1

print(" ".join(str(rang[s]) for s in scores))
