import sys

def main():
    donnees = sys.stdin.read().split()
    n, c = int(donnees[0]), int(donnees[1])
    poids = sorted(map(int, donnees[2:2 + n]))

    leger = 0          # le plus léger des colis restants
    lourd = n - 1      # le plus lourd des colis restants
    caisses = 0
    while leger <= lourd:
        # le plus lourd va dans la prochaine caisse,
        # avec le plus léger si ça ne dépasse pas la charge maximale
        if leger < lourd and poids[leger] + poids[lourd] <= c:
            leger += 1
        lourd -= 1
        caisses += 1
    print(caisses)

main()
