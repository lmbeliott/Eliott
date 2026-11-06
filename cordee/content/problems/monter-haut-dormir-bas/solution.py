a, b, h = map(int, input().split())

# Jour 1 : la cordée monte de a mètres.
jour = 1
hauteur = a

# Tant que le sommet n'est pas atteint, on passe la nuit puis on remonte.
while hauteur < h:
    hauteur = hauteur - b    # la nuit, on redescend
    jour = jour + 1          # nouveau jour
    hauteur = hauteur + a    # on remonte

print(jour)
