import sys

donnees = sys.stdin.read().split()
n = int(donnees[0])
a = [int(x) for x in donnees[1:1 + n]]

# crible jusqu'à 2 000
premier = [True] * 2001
premier[0] = premier[1] = False
for i in range(2, 45):
    if premier[i]:
        for j in range(i * i, 2001, i):
            premier[j] = False

cercle = [a[0]]                    # le premier nombre est fixé : on ne compte qu'une rotation
utilise = [False] * n
utilise[0] = True

def placer():
    if len(cercle) == n:
        return 1 if premier[cercle[-1] + cercle[0]] else 0
    total = 0
    for j in range(1, n):
        if not utilise[j] and premier[cercle[-1] + a[j]]:
            utilise[j] = True
            cercle.append(a[j])
            total += placer()
            cercle.pop()
            utilise[j] = False
    return total

print(placer())
