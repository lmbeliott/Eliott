import sys

def euclide_etendu(a, b):
    # renvoie (g, u, v) avec a × u + b × v = g = PGCD(a, b)
    if b == 0:
        return a, 1, 0
    g, u, v = euclide_etendu(b, a % b)
    return g, v, u - (a // b) * v

def resoudre(a1, m1, a2, m2):
    g, u, v = euclide_etendu(m1, m2)
    d = a2 - a1
    if d % g != 0:
        return -1
    m = m2 // g
    # (m1/g) × u ≡ 1 (mod m2/g)
    k = (u % m) * ((d // g) % m) % m
    return a1 + m1 * k

donnees = sys.stdin.read().split()
t = int(donnees[0])
reponses = []
for i in range(t):
    a1, m1, a2, m2 = map(int, donnees[1 + 4 * i: 5 + 4 * i])
    reponses.append(str(resoudre(a1, m1, a2, m2)))
print("\n".join(reponses))
