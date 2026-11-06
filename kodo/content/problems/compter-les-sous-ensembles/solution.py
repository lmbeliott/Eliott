import sys

NB_PISTES = 16


def main():
    donnees = sys.stdin.buffer.read().split()
    n, q = int(donnees[0]), int(donnees[1])

    # somme[F] = nombre d'abonnés dont les préférences sont exactement F (pour l'instant).
    somme = [0] * (1 << NB_PISTES)
    for x in donnees[2:2 + n]:
        somme[int(x)] += 1

    # Somme sur les sous-ensembles, bit par bit : à la fin,
    # somme[m] = nombre d'abonnés dont les préférences sont un sous-ensemble de m.
    for b in range(NB_PISTES):
        bit = 1 << b
        for m in range(1 << NB_PISTES):
            if m & bit:
                somme[m] += somme[m ^ bit]  # m ^ bit : m privé de la piste b

    ouvertes = donnees[2 + n:2 + n + q]
    print("\n".join(str(somme[int(o)]) for o in ouvertes))


main()
