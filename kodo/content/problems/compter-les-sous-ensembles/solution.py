import sys

NB_BITS = 16


def main():
    donnees = sys.stdin.buffer.read().split()
    n, q = int(donnees[0]), int(donnees[1])

    # somme[a] = nombre d'ensembles de la liste égaux à a (pour l'instant).
    somme = [0] * (1 << NB_BITS)
    for x in donnees[2:2 + n]:
        somme[int(x)] += 1

    # Somme sur les sous-ensembles, bit par bit : à la fin,
    # somme[m] = nombre d'ensembles de la liste inclus dans m.
    for b in range(NB_BITS):
        bit = 1 << b
        for m in range(1 << NB_BITS):
            if m & bit:
                somme[m] += somme[m ^ bit]  # m ^ bit : m privé de l'élément b

    requetes = donnees[2 + n:2 + n + q]
    print("\n".join(str(somme[int(r)]) for r in requetes))


main()
