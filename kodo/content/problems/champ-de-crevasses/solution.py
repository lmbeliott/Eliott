h, w = map(int, input().split())
carte = []
for _ in range(h):
    carte.append(input())

for i in range(h):
    ligne = ""
    for j in range(w):
        if carte[i][j] == "*":
            ligne += "*"
        else:
            # On compte les crevasses parmi les huit voisines.
            nb = 0
            for di in [-1, 0, 1]:
                for dj in [-1, 0, 1]:
                    if di == 0 and dj == 0:
                        continue
                    vi = i + di
                    vj = j + dj
                    # La voisine doit être dans la carte.
                    if 0 <= vi < h and 0 <= vj < w and carte[vi][vj] == "*":
                        nb += 1
            ligne += str(nb)
    print(ligne)
