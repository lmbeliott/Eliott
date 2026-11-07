n = int(input())
h = list(map(int, input().split()))

pile = []        # tailles des personnes encore visibles depuis la droite (décroissantes)
paires = 0
for x in h:
    while len(pile) > 0 and pile[-1] < x:
        pile.pop()               # cette personne voit x, puis sera cachée par x
        paires = paires + 1
    if len(pile) > 0:
        paires = paires + 1      # la première personne plus grande que x
    pile.append(x)
print(paires)
