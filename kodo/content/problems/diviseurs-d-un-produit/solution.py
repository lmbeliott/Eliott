import sys

M = 1000000007
V = 10**6

# pf[x] = plus petit facteur premier de x (0 pour x premier au départ)
pf = [0] * (V + 1)
i = 2
while i * i <= V:
    if pf[i] == 0:                      # i est premier
        for j in range(i * i, V + 1, i):
            if pf[j] == 0:
                pf[j] = i
    i += 1

donnees = sys.stdin.read().split()
n = int(donnees[0])
exposants = {}
for k in range(n):
    x = int(donnees[1 + k])
    while x > 1:
        p = pf[x] if pf[x] != 0 else x  # x premier : son plus petit facteur est lui-même
        x //= p
        exposants[p] = exposants.get(p, 0) + 1

nombre, somme = 1, 1
for p, e in exposants.items():
    nombre = nombre * (e + 1) % M
    # 1 + p + ... + p^e = (p^(e+1) - 1) / (p - 1), division par l'inverse de Fermat
    s = (pow(p, e + 1, M) - 1) * pow(p - 1, M - 2, M) % M
    somme = somme * s % M
print(nombre, somme)
