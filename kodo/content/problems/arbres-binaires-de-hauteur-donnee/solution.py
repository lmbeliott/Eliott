import sys
sys.setrecursionlimit(10000)

MOD = 1000000007
n, h = map(int, input().split())
memo = {}

def au_plus(nb, haut):
    # nombre d'arbres binaires à nb nœuds de hauteur au plus haut (l'arbre vide a pour hauteur -1)
    if nb == 0:
        return 1
    if haut < 0:
        return 0
    if (nb, haut) in memo:
        return memo[(nb, haut)]
    total = 0
    for g in range(nb):        # g nœuds à gauche, nb - 1 - g à droite
        total += au_plus(g, haut - 1) * au_plus(nb - 1 - g, haut - 1)
    total %= MOD
    memo[(nb, haut)] = total
    return total

print((au_plus(n, h) - au_plus(n, h - 1)) % MOD)
