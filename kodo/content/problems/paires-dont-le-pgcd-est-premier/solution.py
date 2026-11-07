import sys
from math import isqrt

def main():
    donnees = sys.stdin.read().split()
    n = int(donnees[0])
    a = list(map(int, donnees[1:n + 1]))
    v = max(a)
    combien = [0] * (v + 1)          # combien[x] : nombre de fois où la valeur x apparaît
    for x in a:
        combien[x] += 1

    # exact[d] : nombre de paires dont le PGCD vaut exactement d.
    # Les paires dont les deux valeurs sont multiples de d ont un PGCD multiple de d :
    # on enlève celles dont le PGCD vaut 2d, 3d, ... (déjà calculées, on descend).
    exact = [0] * (v + 1)
    for d in range(v, 0, -1):
        m = sum(combien[d::d])        # valeurs multiples de d
        exact[d] = m * (m - 1) // 2 - sum(exact[2 * d::d])

    # crible d'Ératosthène jusqu'à v
    est_premier = bytearray([1]) * (v + 1)
    for x in range(min(2, v + 1)):
        est_premier[x] = 0
    for p in range(2, isqrt(v) + 1):
        if est_premier[p]:
            est_premier[p * p::p] = bytes(len(range(p * p, v + 1, p)))

    print(sum(exact[p] for p in range(2, v + 1) if est_premier[p]))

main()
