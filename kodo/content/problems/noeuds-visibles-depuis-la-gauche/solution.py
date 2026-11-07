import sys
from collections import deque

donnees = sys.stdin.read().split()
n = int(donnees[0])
gauche = [0] * (n + 1)
droite = [0] * (n + 1)
est_fils = [False] * (n + 1)
for i in range(1, n + 1):
    gauche[i] = int(donnees[2 * i - 1])
    droite[i] = int(donnees[2 * i])
    est_fils[gauche[i]] = True
    est_fils[droite[i]] = True
racine = next(v for v in range(1, n + 1) if not est_fils[v])

visibles = []
file = deque([(racine, 0)])
while file:
    v, niveau = file.popleft()
    if niveau == len(visibles):       # premier nœud de ce niveau
        visibles.append(v)
    for f in (gauche[v], droite[v]):  # gauche d'abord
        if f != 0:
            file.append((f, niveau + 1))
print(*visibles)
