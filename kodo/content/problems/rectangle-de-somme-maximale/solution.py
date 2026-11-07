import sys


def meilleure_portion(t):
    """Plus grande somme d'une portion non vide de t (balayage du cours)."""
    courant = t[0]
    meilleur = t[0]
    for i in range(1, len(t)):
        if courant >= 0:
            courant += t[i]
        else:
            courant = t[i]
        if courant > meilleur:
            meilleur = courant
    return meilleur


lignes = sys.stdin.read().split("\n")
r, c = map(int, lignes[0].split())
grille = [list(map(int, lignes[1 + i].split())) for i in range(r)]

meilleur = grille[0][0]
for haut in range(r):
    # colonnes[j] : somme de la colonne j entre les lignes haut et bas
    colonnes = [0] * c
    for bas in range(haut, r):
        ligne = grille[bas]
        for j in range(c):
            colonnes[j] += ligne[j]
        meilleur = max(meilleur, meilleure_portion(colonnes))
print(meilleur)
