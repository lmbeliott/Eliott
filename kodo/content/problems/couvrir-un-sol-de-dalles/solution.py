l, h, c = map(int, input().split())

# Division arrondie au-dessus : (X + C - 1) // C.
sur_longueur = (l + c - 1) // c
sur_largeur = (h + c - 1) // c
dalles = sur_longueur * sur_largeur

# Surface de toutes les dalles posées, moins la surface du sol.
jete = dalles * c * c - l * h

print(dalles)
print(jete)
