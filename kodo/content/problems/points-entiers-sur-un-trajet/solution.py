import sys

def pgcd(a, b):
    # algorithme d'Euclide
    while b != 0:
        a, b = b, a % b
    return a

def main():
    donnees = sys.stdin.read().split()
    n = int(donnees[0])
    xs = [int(v) for v in donnees[1:1 + 2 * n:2]]
    ys = [int(v) for v in donnees[2:2 + 2 * n:2]]

    total = 1                            # le point de départ
    for i in range(n - 1):
        dx = abs(xs[i + 1] - xs[i])
        dy = abs(ys[i + 1] - ys[i])
        # le segment est coupé en pgcd(dx, dy) pas égaux, qui tombent sur des points entiers
        total += pgcd(dx, dy)
    print(total)

main()
