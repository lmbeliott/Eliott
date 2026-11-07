import sys

def euclide_etendu(a, b):
    # renvoie (g, u, v) avec a × u + b × v = g = PGCD(a, b)
    if b == 0:
        return a, 1, 0
    g, u, v = euclide_etendu(b, a % b)
    return g, v, u - (a // b) * v

def resoudre(a, b, m):
    g, u, v = euclide_etendu(a, m)
    if b % g != 0:
        return "-1"
    a, b, m2 = a // g, b // g, m // g
    # a × u ≡ g (mod m), donc (a/g) × u ≡ 1 (mod m/g)
    x = (u % m2) * b % m2
    return f"{x} {g}"

donnees = sys.stdin.read().split()
t = int(donnees[0])
reponses = []
for i in range(t):
    a, b, m = map(int, donnees[1 + 3 * i: 4 + 3 * i])
    reponses.append(resoudre(a, b, m))
print("\n".join(reponses))
