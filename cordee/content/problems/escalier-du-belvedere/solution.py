import sys

MOD = 1_000_000_007


def main():
    donnees = sys.stdin.buffer.read().split()
    n, k = int(donnees[0]), int(donnees[1])
    sauts = [int(x) for x in donnees[2:2 + k]]
    glace = donnees[2 + k].decode()  # glace[i - 1] décrit la marche i

    # nb[i] = nombre de façons d'arriver sur la marche i (modulo MOD).
    nb = [0] * (n + 1)
    nb[0] = 1
    for i in range(1, n + 1):
        if glace[i - 1] == '#':
            continue  # marche verglacée : on n'y pose jamais le pied
        total = 0
        for s in sauts:
            if s <= i:
                total += nb[i - s]  # dernier saut de longueur s, depuis la marche i - s
        nb[i] = total % MOD

    print(nb[n])


main()
