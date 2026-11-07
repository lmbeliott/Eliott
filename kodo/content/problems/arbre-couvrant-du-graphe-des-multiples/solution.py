n = int(input())

# ppf[r] = plus petit facteur premier de r (0 tant qu'aucun facteur n'est trouvé)
ppf = [0] * (n + 1)
p = 2
while p * p <= n:
    if ppf[p] == 0:  # p n'a pas de facteur plus petit : il est premier
        for r in range(p * p, n + 1, p):
            if ppf[r] == 0:
                ppf[r] = p
    p += 1

# Le poids minimal vaut la somme des plus petits facteurs premiers de 2, 3, ..., N.
# Un r resté sans facteur est premier : c'est son propre plus petit facteur.
total = 0
for r in range(2, n + 1):
    if ppf[r] == 0:
        total += r
    else:
        total += ppf[r]
print(total)
