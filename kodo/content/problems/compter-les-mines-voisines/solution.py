h, w = map(int, input().split())
grille = []
for _ in range(h):
    grille.append(input())

for i in range(h):
    ligne = ""
    for j in range(w):
        if grille[i][j] == "*":
            ligne += "*"
        else:
            # On compte les mines parmi les huit voisines.
            nb = 0
            for di in [-1, 0, 1]:
                for dj in [-1, 0, 1]:
                    if di == 0 and dj == 0:
                        continue
                    vi = i + di
                    vj = j + dj
                    # La voisine doit être dans la grille.
                    if 0 <= vi < h and 0 <= vj < w and grille[vi][vj] == "*":
                        nb += 1
            ligne += str(nb)
    print(ligne)
