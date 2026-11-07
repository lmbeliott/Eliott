import sys

def main():
    donnees = sys.stdin.buffer.read().split()
    n, m, q, k = int(donnees[0]), int(donnees[1]), int(donnees[2]), int(donnees[3])

    # Tableau de différences en deux dimensions : quatre coins par rectangle.
    diff = [[0] * (m + 2) for _ in range(n + 2)]
    for i in range(q):
        r1 = int(donnees[4 + 4 * i])
        c1 = int(donnees[5 + 4 * i])
        r2 = int(donnees[6 + 4 * i])
        c2 = int(donnees[7 + 4 * i])
        diff[r1][c1] += 1
        diff[r1][c2 + 1] -= 1
        diff[r2 + 1][c1] -= 1
        diff[r2 + 1][c2 + 1] += 1

    # Sommes cumulées : couverture[r][c] = somme des diff[x][y] pour x ≤ r et y ≤ c.
    total = 0
    au_dessus = [0] * (m + 2)          # la ligne précédente, déjà cumulée
    for r in range(1, n + 1):
        ligne = diff[r]
        cumul = 0                      # somme de la ligne r, de la colonne 1 à c
        courante = [0] * (m + 2)
        for c in range(1, m + 1):
            cumul += ligne[c]
            couverture = au_dessus[c] + cumul
            courante[c] = couverture
            if couverture >= k:
                total += 1
        au_dessus = courante
    print(total)

main()
