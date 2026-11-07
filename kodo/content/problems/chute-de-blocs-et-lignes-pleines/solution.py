def place_libre(g, r, c, h, w):
    # Le rectangle de coin (r, c), de taille h x w, est-il dans le puits et vide ?
    if r + h > len(g):
        return False
    for i in range(r, r + h):
        for j in range(c, c + w):
            if g[i][j] == "#":
                return False
    return True


def poser(g, r, c, h, w):
    for i in range(r, r + h):
        for j in range(c, c + w):
            g[i][j] = "#"


def est_pleine(ligne):
    for case in ligne:
        if case == ".":
            return False
    return True


def supprimer_lignes(g):
    # Renvoie la nouvelle grille et le nombre de lignes supprimées.
    largeur = len(g[0])
    gardees = []
    for ligne in g:
        if not est_pleine(ligne):
            gardees.append(ligne)
    k = len(g) - len(gardees)
    h = []
    for i in range(k):
        h.append(["."] * largeur)     # lignes vides en haut
    for ligne in gardees:
        h.append(ligne)
    return h, k


hauteur, largeur, q = map(int, input().split())
g = []
for i in range(hauteur):
    g.append(["."] * largeur)

total = 0
for t in range(q):
    h, w, c = map(int, input().split())
    c = c - 1                         # colonnes numérotées à partir de 0
    r = 0
    while place_libre(g, r + 1, c, h, w):
        r = r + 1
    poser(g, r, c, h, w)
    g, k = supprimer_lignes(g)
    total = total + k

print(total)
for ligne in g:
    print("".join(ligne))
