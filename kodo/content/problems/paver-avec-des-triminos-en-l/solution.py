import sys

# les quatre formes de trimino en L, décrites depuis leur première case
# (la plus haute, puis la plus à gauche) : (décalage de ligne, décalage de colonne)
FORMES = [
    [(0, 0), (0, 1), (1, 0)],
    [(0, 0), (0, 1), (1, 1)],
    [(0, 0), (1, 0), (1, 1)],
    [(0, 0), (1, 0), (1, -1)],
]

def main():
    donnees = sys.stdin.read().split()
    r, c = int(donnees[0]), int(donnees[1])
    couverte = [[ch == '#' for ch in ligne] for ligne in donnees[2:2 + r]]

    libres = sum(ligne.count(False) for ligne in couverte)
    if libres % 3 != 0:
        print(0)
        return

    def compter(pos):
        # nombre de façons de finir le pavage, sachant que les cases avant pos sont couvertes
        while pos < r * c and couverte[pos // c][pos % c]:
            pos += 1
        if pos == r * c:
            return 1                       # tout est couvert : un pavage
        lig, col = divmod(pos, c)
        total = 0
        for forme in FORMES:
            cases = [(lig + dl, col + dc) for dl, dc in forme]
            if all(0 <= l < r and 0 <= k < c and not couverte[l][k] for l, k in cases):
                for l, k in cases:
                    couverte[l][k] = True      # on pose le trimino
                total += compter(pos + 1)
                for l, k in cases:
                    couverte[l][k] = False     # on le retire
        return total

    print(compter(0))

main()
