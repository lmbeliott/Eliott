h, w = map(int, input().split())
grille = []
for _ in range(h):
    grille.append(input().strip())

total = 0
# On choisit les deux lignes du rectangle : celle du haut et celle du bas.
for haut in range(h):
    for bas in range(haut + 1, h):
        # Colonnes où les deux lignes ont une case marquée.
        k = 0
        for c in range(w):
            if grille[haut][c] == "#" and grille[bas][c] == "#":
                k = k + 1
        # Deux de ces colonnes, n'importe lesquelles, forment un rectangle.
        total = total + k * (k - 1) // 2

print(total)
