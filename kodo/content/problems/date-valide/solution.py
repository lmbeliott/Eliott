j, m, a = map(int, input().split())
bissextile = (a % 4 == 0 and a % 100 != 0) or a % 400 == 0
# Nombre de jours du mois m.
if m == 2:
    if bissextile:
        jours_du_mois = 29
    else:
        jours_du_mois = 28
elif m == 4 or m == 6 or m == 9 or m == 11:
    jours_du_mois = 30
else:
    jours_du_mois = 31
if m >= 1 and m <= 12 and j >= 1 and j <= jours_du_mois:
    print("OUI")
else:
    print("NON")
