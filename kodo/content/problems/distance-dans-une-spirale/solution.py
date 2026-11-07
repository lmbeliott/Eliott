def anneau(n):
    # Le carré de côté 2k + 1 centré sur 1 contient les nombres de 1 à (2k + 1)².
    # n est sur l'anneau k : le plus petit k tel que (2k + 1)² ≥ n.
    k = 0
    while (2 * k + 1) * (2 * k + 1) < n:
        k += 1
    return k


def abscisse(n):
    # Colonne de n : 0 pour la case de 1, positive vers la droite.
    k = anneau(n)
    if k == 0:
        return 0
    m = n - (2 * k - 1) * (2 * k - 1)   # rang de n sur son anneau : de 1 à 8k
    if m <= 2 * k:          # côté droit, en montant
        return k
    elif m <= 4 * k:        # côté du haut, vers la gauche
        return k - (m - 2 * k)
    elif m <= 6 * k:        # côté gauche, en descendant
        return -k
    else:                   # côté du bas, vers la droite
        return -k + (m - 6 * k)


def ordonnee(n):
    # Ligne de n : 0 pour la case de 1, positive vers le haut.
    k = anneau(n)
    if k == 0:
        return 0
    m = n - (2 * k - 1) * (2 * k - 1)
    if m <= 2 * k:
        return -k + m
    elif m <= 4 * k:
        return k
    elif m <= 6 * k:
        return k - (m - 4 * k)
    else:
        return -k


def distance(a, b):
    return abs(abscisse(a) - abscisse(b)) + abs(ordonnee(a) - ordonnee(b))


q = int(input())
for _ in range(q):
    a, b = map(int, input().split())
    print(distance(a, b))
