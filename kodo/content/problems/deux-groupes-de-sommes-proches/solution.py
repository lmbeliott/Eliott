import sys
from bisect import bisect_left

def toutes_les_sommes(nombres):
    # sommes de tous les sous-ensembles : chaque nombre est pris ou non
    sommes = [0]
    for x in nombres:
        sommes = sommes + [s + x for s in sommes]
    return sommes

def main():
    donnees = sys.stdin.read().split()
    n = int(donnees[0])
    nombres = [int(x) for x in donnees[1:1 + n]]
    total = sum(nombres)

    gauche = toutes_les_sommes(nombres[:n // 2])
    droite = sorted(toutes_les_sommes(nombres[n // 2:]))

    # un groupe de somme s donne la différence |total - 2s| : on veut s proche de total / 2
    meilleur = total
    for a in gauche:
        # premier b avec 2 * (a + b) >= total, puis son voisin de gauche
        besoin = total - 2 * a                     # il faut 2 * b >= besoin
        seuil = (besoin + 1) // 2 if besoin > 0 else 0
        i = bisect_left(droite, seuil)
        if i < len(droite):
            meilleur = min(meilleur, 2 * (a + droite[i]) - total)
        if i > 0:
            meilleur = min(meilleur, total - 2 * (a + droite[i - 1]))
    print(meilleur)

main()
