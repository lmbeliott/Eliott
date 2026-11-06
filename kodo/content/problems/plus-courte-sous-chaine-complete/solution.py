import sys

def main():
    donnees = sys.stdin.read().split()
    n = int(donnees[0])
    chaine = [ord(c) - ord('a') for c in donnees[1]]

    a_voir = len(set(chaine))   # nombre de lettres différentes de la chaîne
    compte = [0] * 26           # compte[c] = nombre de lettres c dans la fenêtre
    vues = 0                    # lettres différentes présentes dans la fenêtre
    meilleure_longueur = n + 1
    meilleur_debut = 0

    debut = 0
    for fin in range(n):
        c = chaine[fin]
        compte[c] += 1
        if compte[c] == 1:
            vues += 1
        # tant que la fenêtre debut..fin contient tout, on essaie de la raccourcir
        while vues == a_voir:
            if fin - debut + 1 < meilleure_longueur:
                meilleure_longueur = fin - debut + 1
                meilleur_debut = debut
            c = chaine[debut]
            compte[c] -= 1
            if compte[c] == 0:
                vues -= 1
            debut += 1

    print(meilleure_longueur, meilleur_debut + 1)

main()
