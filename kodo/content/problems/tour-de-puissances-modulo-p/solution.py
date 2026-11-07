import sys

P = 1000000007

def puissance(a, n, m):
    # a^n mod m, par exponentiation rapide
    r = 1
    a = a % m
    while n > 0:
        if n % 2 == 1:
            r = r * a % m
        a = a * a % m
        n = n // 2
    return r

def tour(a, b, c):
    if a % P == 0:
        exposant_nul = (b == 0 and c >= 1)
        return 1 if exposant_nul else 0
    e = puissance(b, c, P - 1)      # Fermat : l'exposant compte modulo P - 1
    return puissance(a, e, P)

donnees = sys.stdin.read().split()
t = int(donnees[0])
reponses = []
for i in range(t):
    a, b, c = map(int, donnees[1 + 3 * i: 4 + 3 * i])
    reponses.append(str(tour(a, b, c)))
print("\n".join(reponses))
