import sys

donnees = sys.stdin.read().split()
L = int(donnees[0])
C = int(donnees[1])
grille = donnees[2:2 + L]

h = [0] * (C + 1)        # h[C] = 0 : colonne fictive qui vide la pile
meilleur = 0
for l in range(L):
    ligne = grille[l]
    for c in range(C):
        if ligne[c] == ".":
            h[c] = h[c] + 1
        else:
            h[c] = 0
    # plus grand rectangle sous l'histogramme h
    pile = []            # colonnes de hauteurs croissantes
    for c in range(C + 1):
        while pile and h[pile[-1]] >= h[c]:
            t = pile.pop()
            gauche = pile[-1] if pile else -1
            meilleur = max(meilleur, h[t] * (c - gauche - 1))
        pile.append(c)
print(meilleur)
