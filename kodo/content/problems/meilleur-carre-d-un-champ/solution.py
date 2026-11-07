n, m, k = map(int, input().split())

# s[i][j] = nombre d'arbres des lignes 1..i et colonnes 1..j (ligne 0 et colonne 0 à zéro)
s = [[0] * (m + 1)]
for i in range(1, n + 1):
    ligne = input()
    au_dessus = s[i - 1]
    courante = [0] * (m + 1)
    for j in range(1, m + 1):
        courante[j] = au_dessus[j] + courante[j - 1] - au_dessus[j - 1] + int(ligne[j - 1])
    s.append(courante)

meilleur = -1
ligne_res = 0
col_res = 0
for i in range(k, n + 1):
    for j in range(k, m + 1):
        # carré de coin en bas à droite (i, j)
        total = s[i][j] - s[i - k][j] - s[i][j - k] + s[i - k][j - k]
        if total > meilleur:       # strictement meilleur : on garde le premier
            meilleur = total
            ligne_res = i - k + 1
            col_res = j - k + 1
print(meilleur, ligne_res, col_res)
