import sys


def main():
    donnees = sys.stdin.buffer.read().split()
    n, m = int(donnees[0]), int(donnees[1])
    aretes = sorted((int(donnees[4 + 3 * i]), int(donnees[2 + 3 * i]), int(donnees[3 + 3 * i])) for i in range(m))
    parent = list(range(n + 1))
    taille = [1] * (n + 1)

    def trouver(x):
        racine = x
        while parent[racine] != racine:
            racine = parent[racine]
        while parent[x] != racine:
            parent[x], x = racine, parent[x]
        return racine

    total = 0
    unique = True
    i = 0
    while i < m:
        j = i
        while j < m and aretes[j][0] == aretes[i][0]:
            j += 1
        # groupe des arêtes de même poids : on compte d'abord les arêtes utiles
        utiles = sum(1 for w, a, b in aretes[i:j] if trouver(a) != trouver(b))
        choisies = 0
        for w, a, b in aretes[i:j]:
            a, b = trouver(a), trouver(b)
            if a != b:
                if taille[a] < taille[b]:
                    a, b = b, a
                parent[b] = a
                taille[a] += taille[b]
                total += w
                choisies += 1
        if utiles > choisies:  # une arête utile laissée de côté pouvait remplacer une choisie
            unique = False
        i = j
    print(total)
    print("OUI" if unique else "NON")


main()
