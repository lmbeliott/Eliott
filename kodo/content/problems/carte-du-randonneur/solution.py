h, w = map(int, input().split())
carte = []
for _ in range(h):
    carte.append(input())

# On cherche la position de Yanis et celle du refuge.
for i in range(h):
    for j in range(w):
        if carte[i][j] == "Y":
            ly, cy = i, j
        if carte[i][j] == "R":
            lr, cr = i, j

# Pas verticaux + pas horizontaux.
print(abs(ly - lr) + abs(cy - cr))
