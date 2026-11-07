import sys

def main():
    donnees = sys.stdin.buffer.read().split()
    n = int(donnees[0])
    gains, pertes = [], []
    for i in range(n):
        r, g = int(donnees[1 + 2 * i]), int(donnees[2 + 2 * i])
        if g >= 0:
            gains.append((r, g))
        else:
            pertes.append((r, g))

    # d'abord les tâches qui rapportent, de la moins exigeante à la plus exigeante,
    # puis celles qui coûtent, par énergie restante r + g décroissante
    gains.sort()
    pertes.sort(key=lambda t: t[0] + t[1], reverse=True)

    besoin = 0       # énergie de départ minimale pour les tâches déjà placées
    variation = 0    # changement d'énergie total depuis le départ
    for r, g in gains + pertes:
        besoin = max(besoin, r - variation)
        variation += g
    print(besoin)

main()
