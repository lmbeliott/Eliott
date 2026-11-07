import sys

def main():
    donnees = sys.stdin.read().split()
    n, m, t = int(donnees[0]), int(donnees[1]), int(donnees[2])
    grille = donnees[3:3 + n]

    # pref[i][j] = nombre de cases marquées dans le rectangle des i premières lignes
    # et des j premières colonnes
    pref = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        ligne = grille[i - 1]
        au_dessus = pref[i - 1]
        courante = pref[i]
        somme_ligne = 0
        for j in range(1, m + 1):
            if ligne[j - 1] == '#':
                somme_ligne += 1
            courante[j] = au_dessus[j] + somme_ligne

    # pour chaque coin bas-droit (i, j), on essaie d'agrandir le meilleur côté trouvé
    meilleur = 0
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            while meilleur < i and meilleur < j:
                k = meilleur + 1
                marquees = pref[i][j] - pref[i - k][j] - pref[i][j - k] + pref[i - k][j - k]
                if marquees > t:
                    break
                meilleur = k
    print(meilleur)

main()
