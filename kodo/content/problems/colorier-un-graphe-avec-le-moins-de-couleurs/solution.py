import sys

donnees = sys.stdin.read().split()
n, m = int(donnees[0]), int(donnees[1])
voisins = [[] for _ in range(n)]
for k in range(m):
    a = int(donnees[2 + 2 * k]) - 1
    b = int(donnees[3 + 2 * k]) - 1
    voisins[a].append(b)
    voisins[b].append(a)

# on colorie d'abord les sommets de plus grand degré : les conflits apparaissent tôt
ordre = sorted(range(n), key=lambda v: -len(voisins[v]))
couleur = [-1] * n

def colorier(i, k, utilisees):
    # colorie ordre[i], ordre[i + 1], ... avec les couleurs 0 à k - 1
    if i == n:
        return True
    v = ordre[i]
    interdites = set(couleur[u] for u in voisins[v])
    # les couleurs sont interchangeables : une nouvelle couleur est toujours la suivante
    for c in range(min(k, utilisees + 1)):
        if c not in interdites:
            couleur[v] = c
            if colorier(i + 1, k, max(utilisees, c + 1)):
                return True
            couleur[v] = -1
    return False

k = 1
while not colorier(0, k, 0):
    k += 1
print(k)
