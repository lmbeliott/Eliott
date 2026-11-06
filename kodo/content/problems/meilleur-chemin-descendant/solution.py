import sys

MOD = 1_000_000_007
AUCUNE = -1  # case inatteignable (ou interdite)


def main():
    donnees = sys.stdin.buffer.read().split()
    r, c = int(donnees[0]), int(donnees[1])
    grille = [ligne.decode() for ligne in donnees[2:2 + r]]

    # meilleur[j + 1] et nombre[j + 1] décrivent la case de colonne j de la ligne courante ;
    # les cases 0 et c + 1 sont des bords toujours inatteignables.
    meilleur = [AUCUNE] * (c + 2)
    nombre = [0] * (c + 2)
    for j in range(c):
        if grille[0][j] != '#':
            meilleur[j + 1] = int(grille[0][j])
            nombre[j + 1] = 1

    for i in range(1, r):
        ligne = grille[i]
        nouv_meilleur = [AUCUNE] * (c + 2)
        nouv_nombre = [0] * (c + 2)
        for j in range(1, c + 1):
            if ligne[j - 1] == '#':
                continue
            # On cherche la meilleure des trois cases du dessus, et combien de chemins y mènent.
            m, n = AUCUNE, 0
            for k in (j - 1, j, j + 1):
                if meilleur[k] > m:
                    m, n = meilleur[k], nombre[k]
                elif meilleur[k] == m and m != AUCUNE:
                    n += nombre[k]
            if m != AUCUNE:
                nouv_meilleur[j] = m + int(ligne[j - 1])
                nouv_nombre[j] = n % MOD
        meilleur, nombre = nouv_meilleur, nouv_nombre

    meilleure = max(meilleur)
    if meilleure == AUCUNE:
        print(-1)
    else:
        total = sum(nombre[j] for j in range(c + 2) if meilleur[j] == meilleure) % MOD
        print(meilleure, total)


main()
