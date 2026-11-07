from itertools import compress
from math import isqrt

n = int(input())

# Le poids minimal vaut la somme des plus petits facteurs premiers de 2, 3, ..., N.
# marque[r] = 1 quand le plus petit facteur premier de r est déjà compté.
marque = bytearray(n + 1)
marque[0] = 1
if n >= 1:
    marque[1] = 1
total = 0
for p in range(2, isqrt(n) + 1):
    if not marque[p]:  # p n'a pas de facteur plus petit : il est premier
        # les multiples de p pas encore marqués sont les r dont le plus petit facteur premier est p
        total += p * marque[p::p].count(0)
        marque[p::p] = b"\x01" * len(range(p, n + 1, p))
# les r restants sont les nombres premiers plus grands que √N : leur plus petit facteur est eux-mêmes
restants = marque.translate(bytes([1, 0]) + bytes(254))
total += sum(compress(range(n + 1), restants))
print(total)
