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

INFINI = 2 * 10 ** 9
correct = True
file = deque([(racine, -INFINI, INFINI)])   # la clé doit être dans ]bas, haut[
while file and correct:
    v, bas, haut = file.popleft()
    if not (bas < cle[v] < haut):
        correct = False
    if gauche[v] != 0:
        file.append((gauche[v], bas, cle[v]))
    if droite[v] != 0:
        file.append((droite[v], cle[v], haut))
print("OUI" if correct else "NON")
