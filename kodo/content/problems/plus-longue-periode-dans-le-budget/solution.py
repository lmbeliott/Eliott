import sys

def main():
    donnees = sys.stdin.read().split()
    n, budget = int(donnees[0]), int(donnees[1])
    prix = list(map(int, donnees[2:2 + n]))

    meilleur = 0
    debut = 0   # la fenêtre contient les jours debut..fin
    total = 0   # prix total des jours de la fenêtre
    for fin in range(n):
        total += prix[fin]
        # trop cher : on retire des jours au début
        while total > budget:
            total -= prix[debut]
            debut += 1
        meilleur = max(meilleur, fin - debut + 1)
    print(meilleur)

main()
