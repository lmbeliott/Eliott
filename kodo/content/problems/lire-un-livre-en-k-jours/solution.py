import sys

def jours_necessaires(chapitres, limite):
    # nombre minimal de jours si on ne lit jamais plus de `limite` pages par jour
    # (on suppose limite >= le plus long chapitre)
    jours = 1
    aujourd_hui = 0
    for pages in chapitres:
        if aujourd_hui + pages > limite:
            jours += 1            # on s'arrête là et on reprend le lendemain
            aujourd_hui = pages
        else:
            aujourd_hui += pages
    return jours

def main():
    donnees = sys.stdin.read().split()
    n, k = int(donnees[0]), int(donnees[1])
    chapitres = list(map(int, donnees[2:2 + n]))

    trop_petit = max(chapitres) - 1   # impossible : un chapitre ne rentre pas
    suffisant = sum(chapitres)        # tout en un seul jour
    while suffisant - trop_petit > 1:
        milieu = (trop_petit + suffisant) // 2
        if jours_necessaires(chapitres, milieu) <= k:
            suffisant = milieu
        else:
            trop_petit = milieu
    print(suffisant)

main()
