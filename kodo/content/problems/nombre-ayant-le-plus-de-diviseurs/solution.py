n = int(input())
meilleur = 0              # l'entier retenu
meilleur_nb = 0           # son nombre de diviseurs
for i in range(n):
    x = int(input())
    nb = 0                # remis à 0 pour chaque entier
    d = 1
    while d * d <= x:
        if x % d == 0:
            if d * d == x:
                nb = nb + 1   # d et x // d sont le même diviseur
            else:
                nb = nb + 2   # d et x // d
        d = d + 1
    if nb > meilleur_nb or (nb == meilleur_nb and x < meilleur):
        meilleur = x
        meilleur_nb = nb
print(meilleur, meilleur_nb)
