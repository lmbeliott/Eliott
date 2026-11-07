import sys

def euclide_etendu(a, b):
    # renvoie (g, u, v) avec a × u + b × v = g = PGCD(a, b)
    if b == 0:
        return a, 1, 0
    g, u, v = euclide_etendu(b, a % b)
    return g, v, u - (a // b) * v

def compte(a, b, c):
    g, u, v = euclide_etendu(a, b)
    if c % g != 0:
        return 0
    b2 = b // g
    # (a/g) × u ≡ 1 (mod b/g) ; plus petit x possible
    x0 = (u % b2) * ((c // g) % b2) % b2
    if a * x0 > c:
        return 0
    return (c - a * x0) // (a * b2) + 1

donnees = sys.stdin.read().split()
t = int(donnees[0])
reponses = []
for i in range(t):
    a, b, c = map(int, donnees[1 + 3 * i: 4 + 3 * i])
    reponses.append(str(compte(a, b, c)))
print("\n".join(reponses))
