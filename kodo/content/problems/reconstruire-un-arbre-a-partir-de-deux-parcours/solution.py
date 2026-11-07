import sys
sys.setrecursionlimit(10000)

donnees = sys.stdin.read().split()
n = int(donnees[0])
prefixe = [int(x) for x in donnees[1:1 + n]]
infixe = [int(x) for x in donnees[1 + n:1 + 2 * n]]
position = [0] * (n + 1)          # position de chaque nœud dans l'ordre infixe
for k in range(n):
    position[infixe[k]] = k

suffixe = []
possible = True

def construire(p, i, taille):
    # sous-arbre : prefixe[p .. p+taille-1] et infixe[i .. i+taille-1]
    global possible
    if taille == 0 or not possible:
        return
    racine = prefixe[p]
    k = position[racine]
    if not (i <= k < i + taille):
        possible = False
        return
    g = k - i                     # taille du sous-arbre gauche
    construire(p + 1, i, g)
    construire(p + 1 + g, k + 1, taille - 1 - g)
    suffixe.append(racine)

construire(0, 0, n)
print(" ".join(map(str, suffixe)) if possible else "IMPOSSIBLE")
