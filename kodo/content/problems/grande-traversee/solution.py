import sys

def jours_necessaires(troncons, limite):
    # nombre minimal de jours si on ne marche jamais plus de `limite` km par jour
    # (on suppose limite >= le plus long tronçon)
    jours = 1
    aujourd_hui = 0
    for longueur in troncons:
        if aujourd_hui + longueur > limite:
            jours += 1            # on dort au refuge et on repart demain
            aujourd_hui = longueur
        else:
            aujourd_hui += longueur
    return jours

def main():
    donnees = sys.stdin.read().split()
    n, k = int(donnees[0]), int(donnees[1])
    troncons = list(map(int, donnees[2:2 + n]))

    trop_petit = max(troncons) - 1   # impossible : un tronçon ne rentre pas
    suffisant = sum(troncons)        # tout en un seul jour
    while suffisant - trop_petit > 1:
        milieu = (trop_petit + suffisant) // 2
        if jours_necessaires(troncons, milieu) <= k:
            suffisant = milieu
        else:
            trop_petit = milieu
    print(suffisant)

main()
