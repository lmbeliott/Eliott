import sys

lignes = sys.stdin.read().split()
grille = [[0 if ch == "." else int(ch) for ch in ligne] for ligne in lignes[:6]]

def bloc(i, j):
    return (i // 2) * 2 + j // 3        # blocs de 2 lignes et 3 colonnes

# masques des chiffres déjà présents : bit d pour le chiffre d
ligne_m = [0] * 6
col_m = [0] * 6
bloc_m = [0] * 6
vides = []
coherente = True
for i in range(6):
    for j in range(6):
        d = grille[i][j]
        if d == 0:
            vides.append((i, j))
        else:
            bit = 1 << d
            if (ligne_m[i] | col_m[j] | bloc_m[bloc(i, j)]) & bit:
                coherente = False       # deux chiffres identiques au départ
            ligne_m[i] |= bit
            col_m[j] |= bit
            bloc_m[bloc(i, j)] |= bit

TOUS = 0b1111110                        # chiffres 1 à 6

def compter():
    # on remplit d'abord la case vide qui a le moins de chiffres possibles
    meilleure = -1
    meilleur_choix = 0
    nb_min = 7
    for k, (i, j) in enumerate(vides):
        if grille[i][j] == 0:
            possibles = TOUS & ~(ligne_m[i] | col_m[j] | bloc_m[bloc(i, j)])
            nb = bin(possibles).count("1")
            if nb < nb_min:
                nb_min, meilleure, meilleur_choix = nb, k, possibles
    if meilleure == -1:
        return 1                        # grille pleine : une complétion
    i, j = vides[meilleure]
    total = 0
    for d in range(1, 7):
        if meilleur_choix >> d & 1:
            bit = 1 << d
            grille[i][j] = d
            ligne_m[i] |= bit
            col_m[j] |= bit
            bloc_m[bloc(i, j)] |= bit
            total += compter()
            ligne_m[i] &= ~bit
            col_m[j] &= ~bit
            bloc_m[bloc(i, j)] &= ~bit
            grille[i][j] = 0
    return total

print(compter() if coherente else 0)
