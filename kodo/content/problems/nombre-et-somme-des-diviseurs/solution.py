import sys

def nombre_et_somme(n):
    nb, somme = 1, 1
    d = 2
    while d * d <= n:
        if n % d == 0:
            e = 0
            puissance, total = 1, 1      # total = 1 + d + ... + d^e
            while n % d == 0:
                n //= d
                e += 1
                puissance *= d
                total += puissance
            nb *= e + 1
            somme *= total
        d = 3 if d == 2 else d + 2       # 2, puis les impairs
    if n > 1:                            # le reste est premier
        nb *= 2
        somme *= 1 + n
    return nb, somme

donnees = sys.stdin.read().split()
t = int(donnees[0])
for i in range(t):
    nb, somme = nombre_et_somme(int(donnees[1 + i]))
    print(nb, somme)
