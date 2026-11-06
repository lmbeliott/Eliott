import sys

def main():
    donnees = sys.stdin.read().split()
    n = int(donnees[0])
    falaise = donnees[1:1 + n]

    colonne = [False] * n          # colonne déjà surveillée ?
    diag1 = [False] * (2 * n)      # diagonales « / » : ligne + col constant
    diag2 = [False] * (2 * n)      # diagonales « \ » : ligne - col constant
    total = 0

    def placer(ligne):
        nonlocal total
        if ligne == n:
            total += 1             # une caméra sur chaque ligne : solution trouvée
            return
        for col in range(n):
            if (falaise[ligne][col] == '.' and not colonne[col]
                    and not diag1[ligne + col] and not diag2[ligne - col + n]):
                colonne[col] = diag1[ligne + col] = diag2[ligne - col + n] = True
                placer(ligne + 1)
                colonne[col] = diag1[ligne + col] = diag2[ligne - col + n] = False

    placer(0)
    print(total)

main()
