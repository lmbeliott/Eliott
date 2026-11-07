m, k = map(int, input().split())

# On compte à partir de 0 : rangée R, et rang P dans la rangée.
r = (k - 1) // m
p = (k - 1) % m

# E vaut 0 si la rangée va de gauche à droite, 1 si elle va de droite à gauche.
e = r % 2

# Quand E = 0, il reste P + 1 ; quand E = 1, il reste M - P.
place = (1 - e) * (p + 1) + e * (m - p)
print(r + 1, place)
