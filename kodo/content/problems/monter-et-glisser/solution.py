a, b, h = map(int, input().split())

# Jour 1 : l'escargot monte de a centimètres.
jour = 1
hauteur = a

# Tant qu'il n'est pas en haut, il passe la nuit puis remonte.
while hauteur < h:
    hauteur = hauteur - b    # la nuit, il redescend
    jour = jour + 1          # nouveau jour
    hauteur = hauteur + a    # il remonte

print(jour)
