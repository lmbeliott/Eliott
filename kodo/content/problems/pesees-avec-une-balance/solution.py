def explorer(i, d):
    # les poids 0 à i-1 sont placés ; d = (masse à droite) - (masse à gauche)
    if i == n:
        if d > 0:
            masses.add(d)
        return
    explorer(i + 1, d)            # poids i de côté
    explorer(i + 1, d + p[i])     # poids i à droite
    explorer(i + 1, d - p[i])     # poids i à gauche, avec l'objet

n = int(input())
p = list(map(int, input().split()))
masses = set()
explorer(0, 0)

m = 1
while m in masses:
    m = m + 1
print(len(masses), m)
