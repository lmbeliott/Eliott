precedente = int(input())     # la première mesure : un plateau de longueur 1
longueur = 1
meilleure_longueur = 1
meilleure_valeur = precedente
x = int(input())
while x != -1:
    if x == precedente:
        longueur = longueur + 1   # le plateau en cours s'allonge
    else:
        longueur = 1              # un nouveau plateau commence
    if longueur > meilleure_longueur:
        meilleure_longueur = longueur
        meilleure_valeur = x
    precedente = x
    x = int(input())
print(meilleure_longueur, meilleure_valeur)
