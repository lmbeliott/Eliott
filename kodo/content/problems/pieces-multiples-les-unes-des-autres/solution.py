import sys

donnees = sys.stdin.read().split()
k = int(donnees[0])
pieces = [int(x) for x in donnees[1:1 + k]]
q = int(donnees[1 + k])
reponses = []
for i in range(q):
    s = int(donnees[2 + k + i])
    nb = 0
    for c in reversed(pieces):      # de la plus grande à la plus petite
        nb += s // c
        s = s % c
    reponses.append(str(nb))
print("\n".join(reponses))
