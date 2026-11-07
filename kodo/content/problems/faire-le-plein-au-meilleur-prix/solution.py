import sys
from collections import deque

def main():
    donnees = sys.stdin.buffer.read().split()
    n, longueur, capacite = int(donnees[0]), int(donnees[1]), int(donnees[2])
    positions = [int(x) for x in donnees[3:3 + 2 * n:2]]
    prix = [int(x) for x in donnees[4:4 + 2 * n:2]]
    positions.append(longueur)          # l'arrivée, comme une dernière étape

    # le réservoir : des lots [prix, litres], du moins cher (à gauche) au plus cher.
    # On ne paie un litre qu'au moment où on le consomme : un litre jamais
    # consommé n'a jamais vraiment été acheté.
    reservoir = deque()
    dans_le_reservoir = 0
    cout = 0
    for i in range(n):
        # ici, on revend (on « n'achète pas ») le carburant plus cher que celui de la station
        while reservoir and reservoir[-1][0] > prix[i]:
            dans_le_reservoir -= reservoir.pop()[1]
        # puis on fait le plein au prix de la station
        if dans_le_reservoir < capacite:
            reservoir.append([prix[i], capacite - dans_le_reservoir])
            dans_le_reservoir = capacite
        # on roule jusqu'à l'étape suivante en brûlant d'abord le moins cher
        distance = positions[i + 1] - positions[i]
        if distance > capacite:
            print(-1)
            return
        dans_le_reservoir -= distance
        while distance > 0:
            lot = reservoir[0]
            pris = min(distance, lot[1])
            cout += pris * lot[0]
            lot[1] -= pris
            distance -= pris
            if lot[1] == 0:
                reservoir.popleft()
    print(cout)

main()
