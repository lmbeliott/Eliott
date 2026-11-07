import sys
from collections import deque

donnees = sys.stdin.read().split()
n = int(donnees[0])
cle = [0] * (n + 1)
gauche = [0] * (n + 1)
droite = [0] * (n + 1)
est_fils = [False] * (n + 1)
for i in range(1, n + 1):
    cle[i] = int(donnees[3 * i - 2])
    gauche[i] = int(donnees[3 * i - 1])
    droite[i] = int(donnees[3 * i])
    est_fils[gauche[i]] = True
    est_fils[droite[i]] = True
racine = next(v for v in range(1, n + 1) if not est_fils[v])

# ordre en largeur : chaque père avant ses fils ; à l'envers, chaque fils avant son père
ordre = []
file = deque([racine])
while file:
    v = file.popleft()
    ordre.append(v)
    for f in (gauche[v], droite[v]):
        if f != 0:
            file.append(f)

INFINI = 2 * 10 ** 9
# pour chaque sous-arbre : est-ce un ABR ? sa taille, sa plus petite et sa plus grande clé
abr = [True] * (n + 1)          # l'indice 0 représente l'arbre vide
taille = [0] * (n + 1)
mini = [INFINI] * (n + 1)
maxi = [-INFINI] * (n + 1)
meilleur = 0
for v in reversed(ordre):
    g, d = gauche[v], droite[v]
    taille[v] = taille[g] + taille[d] + 1
    mini[v] = min(mini[g], cle[v])
    maxi[v] = max(maxi[d], cle[v])
    abr[v] = abr[g] and abr[d] and maxi[g] < cle[v] < mini[d]
    if abr[v]:
        meilleur = max(meilleur, taille[v])
print(meilleur)
