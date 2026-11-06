import sys

def main():
    donnees = sys.stdin.read().split()
    n, k = int(donnees[0]), int(donnees[1])
    sentier = donnees[2]

    # vues[h] = nombre de bornes déjà rencontrées à l'altitude h
    vues = {}
    altitude = 0
    total = 0
    for j in range(n + 1):
        if j > 0:
            pas = sentier[j - 1]
            if pas == 'M':
                altitude += 1
            elif pas == 'D':
                altitude -= 1
        # départs possibles : les bornes précédentes situées K mètres plus haut
        total += vues.get(altitude + k, 0)
        vues[altitude] = vues.get(altitude, 0) + 1
    print(total)

main()
