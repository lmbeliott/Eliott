h, w = map(int, input().split())
grille = []
for _ in range(h):
    grille.append(input())

# On cherche la position de A et celle de B.
for i in range(h):
    for j in range(w):
        if grille[i][j] == "A":
            la, ca = i, j
        if grille[i][j] == "B":
            lb, cb = i, j

# Pas verticaux + pas horizontaux.
print(abs(la - lb) + abs(ca - cb))
