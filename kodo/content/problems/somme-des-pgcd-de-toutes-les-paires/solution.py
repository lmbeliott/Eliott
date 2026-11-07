import sys

donnees = sys.stdin.read().split()
n = int(donnees[0])
valeurs = [int(x) for x in donnees[1:n + 1]]
M = max(valeurs)

f = [0] * (M + 1)              # f[v] = nombre de positions de valeur v
for v in valeurs:
    f[v] = f[v] + 1

# exact[d] = nombre de paires dont le PGCD vaut exactement d
exact = [0] * (M + 1)
total = 0
for d in range(M, 0, -1):
    cnt = 0                    # nombre de valeurs multiples de d
    for m in range(d, M + 1, d):
        cnt = cnt + f[m]
    paires = cnt * (cnt - 1) // 2          # paires dont le PGCD est un multiple de d
    for m in range(2 * d, M + 1, d):
        paires = paires - exact[m]         # on retire celles de PGCD 2d, 3d, ...
    exact[d] = paires
    total = total + d * paires
print(total)
