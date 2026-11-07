s = input()

resultat = ""
i = 0
while i < len(s):
    # Le groupe commence en i : on avance j tant que la lettre est la même.
    j = i
    while j < len(s) and s[j] == s[i]:
        j = j + 1
    taille = j - i
    resultat = resultat + s[i]
    if taille >= 2:
        resultat = resultat + str(taille)
    # Le groupe suivant commence en j.
    i = j

print(resultat)
