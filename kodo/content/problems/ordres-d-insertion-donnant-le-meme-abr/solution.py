import sys

MOD = 1000000007
donnees = sys.stdin.read().split()
n = int(donnees[0])
ordre = [int(x) for x in donnees[1:1 + n]]

# construction de l'arbre binaire de recherche par insertions successives
gauche = [0] * (n + 1)
droite = [0] * (n + 1)
racine = ordre[0]
for x in ordre[1:]:
    v = racine
    while True:
        if x < v:
            if gauche[v] == 0:
                gauche[v] = x
                break
            v = gauche[v]
        else:
            if droite[v] == 0:
                droite[v] = x
                break
            v = droite[v]

# factorielles et inverses modulo MOD (petit théorème de Fermat)
fact = [1] * (n + 1)
for i in range(1, n + 1):
    fact[i] = fact[i - 1] * i % MOD
inv_fact = [1] * (n + 1)
inv_fact[n] = pow(fact[n], MOD - 2, MOD)
for i in range(n, 0, -1):
    inv_fact[i - 1] = inv_fact[i] * i % MOD

def binomial(a, b):
    return fact[a] * inv_fact[b] % MOD * inv_fact[a - b] % MOD

# les descendants d'un nœud sont insérés après lui :
# en parcourant l'ordre à l'envers, les fils sont traités avant leur père
taille = [0] * (n + 1)
facons = [1] * (n + 1)              # facons[0] = 1 pour l'arbre vide
for v in reversed(ordre):
    g, d = gauche[v], droite[v]
    taille[v] = taille[g] + taille[d] + 1
    facons[v] = binomial(taille[g] + taille[d], taille[g]) * facons[g] % MOD * facons[d] % MOD
print(facons[racine])
