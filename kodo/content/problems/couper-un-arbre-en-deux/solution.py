import sys


def main():
    donnees = sys.stdin.buffer.read().split()
    n = int(donnees[0])
    poids = [0] + [int(x) for x in donnees[1:1 + n]]
    parent = [0, 0] + [int(x) for x in donnees[1 + n:2 * n]]  # parent[v] pour v de 2 à N
    enfants = [[] for _ in range(n + 1)]
    for v in range(2, n + 1):
        enfants[parent[v]].append(v)

    # Parcours en largeur depuis la racine : chaque sommet apparaît après son parent.
    ordre = [1]
    for u in ordre:
        ordre.extend(enfants[u])

    # En sens inverse, chaque sommet est traité après tous ses enfants.
    sous = poids[:]  # sous[v] = poids total du sous-arbre de v
    for v in reversed(ordre):
        if v != 1:
            sous[parent[v]] += sous[v]

    total = sous[1]
    meilleur, nombre = None, 0
    for v in range(2, n + 1):
        # Couper l'arête v — parent[v] sépare le sous-arbre de v du reste.
        ecart = abs(total - 2 * sous[v])
        if meilleur is None or ecart < meilleur:
            meilleur, nombre = ecart, 1
        elif ecart == meilleur:
            nombre += 1
    print(meilleur, nombre)


main()
