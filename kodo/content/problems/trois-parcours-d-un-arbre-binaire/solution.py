import sys
sys.setrecursionlimit(10000)

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

prefixe, infixe, suffixe = [], [], []

def parcourir(v):
    if v == 0:
        return
    prefixe.append(v)           # avant les fils
    parcourir(gauche[v])
    infixe.append(v)            # entre les deux fils
    parcourir(droite[v])
    suffixe.append(v)           # après les fils

parcourir(racine)
print(*prefixe)
print(*infixe)
print(*suffixe)
