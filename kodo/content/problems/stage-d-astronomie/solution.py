import sys

def main():
    donnees = sys.stdin.read().split()
    n = int(donnees[0])
    carnet = [ord(c) - ord('a') for c in donnees[1]]

    a_voir = len(set(carnet))   # nombre de constellations différentes du carnet
    compte = [0] * 26           # compte[c] = nuits de la fenêtre où l'on voit c
    vues = 0                    # constellations présentes dans la fenêtre
    meilleure_duree = n + 1
    meilleur_debut = 0

    debut = 0
    for fin in range(n):
        c = carnet[fin]
        compte[c] += 1
        if compte[c] == 1:
            vues += 1
        # tant que la fenêtre debut..fin contient tout, on essaie de la raccourcir
        while vues == a_voir:
            if fin - debut + 1 < meilleure_duree:
                meilleure_duree = fin - debut + 1
                meilleur_debut = debut
            c = carnet[debut]
            compte[c] -= 1
            if compte[c] == 0:
                vues -= 1
            debut += 1

    print(meilleure_duree, meilleur_debut + 1)

main()
