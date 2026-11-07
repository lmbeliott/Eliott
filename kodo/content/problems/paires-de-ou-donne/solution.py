import sys

BITS = 16
TAILLE = 1 << BITS


def main():
    donnees = sys.stdin.buffer.read().split()
    n = int(donnees[0])
    a = donnees[1:1 + n]
    q = int(donnees[1 + n])
    requetes = donnees[2 + n:2 + n + q]

    # f[m] : nombre de valeurs égales à m, puis nombre de valeurs dont les bits sont inclus dans m
    f = [0] * TAILLE
    for x in a:
        f[int(x)] += 1
    for b in range(BITS):
        pas = 1 << b
        # Les masques qui ont le bit b forment des blocs de « pas » cases, un bloc sur deux.
        for debut in range(pas, TAILLE, 2 * pas):
            for m in range(debut, debut + pas):
                f[m] += f[m - pas]

    # g[m] : nombre de paires dont le OU est inclus dans m (les deux valeurs le sont)
    g = [c * (c - 1) // 2 for c in f]
    # On enlève, bit par bit, les paires dont le OU est strictement inclus : il reste le OU égal à m.
    for b in range(BITS):
        pas = 1 << b
        for debut in range(pas, TAILLE, 2 * pas):
            for m in range(debut, debut + pas):
                g[m] -= g[m - pas]

    print("\n".join(str(g[int(x)]) for x in requetes))


main()
