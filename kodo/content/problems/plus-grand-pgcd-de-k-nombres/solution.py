import sys

donnees = sys.stdin.read().split()
n = int(donnees[0])
valeurs = [int(x) for x in donnees[1:n + 1]]
M = max(valeurs)

f = [0] * (M + 1)               # f[v] = nombre de positions de valeur v
for v in valeurs:
    f[v] = f[v] + 1

reponse = [0] * (n + 1)
k = 1
for d in range(M, 0, -1):
    cnt = 0                     # nombre de multiples de d parmi les valeurs
    for m in range(d, M + 1, d):
        cnt = cnt + f[m]
    while k <= n and cnt >= k:
        reponse[k] = d          # plus grand d avec au moins k multiples
        k = k + 1

print(" ".join(map(str, reponse[1:])))
