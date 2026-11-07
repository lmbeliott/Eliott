import sys


def main():
    donnees = list(map(int, sys.stdin.buffer.read().split()))
    n = donnees[0]
    duree = donnees[1::3][:n]
    limite = donnees[2::3][:n]
    poids = donnees[3::3][:n]

    total = 1 << n
    # fin[m] = instant où se termine le groupe de tâches m, quel que soit l'ordre
    fin = [0] * total
    for m in range(1, total):
        bas = m & -m
        fin[m] = fin[m ^ bas] + duree[bas.bit_length() - 1]

    # meilleur[m] = pénalité minimale pour faire d'abord exactement les tâches de m
    meilleur = [0] * total
    for m in range(1, total):
        t = fin[m]
        res = -1
        reste = m
        while reste:
            bas = reste & -reste
            reste ^= bas
            j = bas.bit_length() - 1
            # la tâche j est la dernière du groupe m : elle se termine à l'instant t
            retard = t - limite[j]
            cout = meilleur[m ^ bas] + (poids[j] * retard if retard > 0 else 0)
            if res < 0 or cout < res:
                res = cout
        meilleur[m] = res
    print(meilleur[total - 1])


main()
