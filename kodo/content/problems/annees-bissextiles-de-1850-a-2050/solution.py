# 1900 n'est pas bissextile (divisible par 100 mais pas par 400) :
# on coupe la suite de 4 en 4 en deux boucles.
for annee in range(1852, 1900, 4):
    print(annee)
# 2000 est divisible par 400 : la règle habituelle s'applique.
for annee in range(1904, 2049, 4):
    print(annee)
