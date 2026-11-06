import sys

def main():
    donnees = sys.stdin.read().split()
    n, k = int(donnees[0]), int(donnees[1])
    symboles = donnees[2]

    # vues[h] = nombre de points déjà rencontrés à la hauteur h
    vues = {}
    hauteur = 0
    total = 0
    for j in range(n + 1):
        if j > 0:
            pas = symboles[j - 1]
            if pas == '+':
                hauteur += 1
            elif pas == '-':
                hauteur -= 1
        # départs possibles : les points précédents situés K plus haut
        total += vues.get(hauteur + k, 0)
        vues[hauteur] = vues.get(hauteur, 0) + 1
    print(total)

main()
