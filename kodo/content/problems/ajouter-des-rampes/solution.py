import sys

def main():
    donnees = sys.stdin.buffer.read().split()
    n, q = int(donnees[0]), int(donnees[1])

    # la rampe (L, R) ajoute x - L + 1 = 1 * x + (1 - L) à chaque case x de L à R :
    # on note le début et la fin de chaque pente et de chaque constante
    pente = [0] * (n + 2)
    constante = [0] * (n + 2)
    for k in range(q):
        l = int(donnees[2 + 2 * k])
        r = int(donnees[3 + 2 * k])
        pente[l] += 1
        pente[r + 1] -= 1
        constante[l] += 1 - l
        constante[r + 1] -= 1 - l

    a = 0              # somme des pentes des rampes qui couvrent la case x
    b = 0              # somme de leurs constantes
    maximum = -1
    nombre = 0
    for x in range(1, n + 1):
        a += pente[x]
        b += constante[x]
        valeur = a * x + b
        if valeur > maximum:
            maximum = valeur
            nombre = 1
        elif valeur == maximum:
            nombre += 1
    print(maximum, nombre)

main()
