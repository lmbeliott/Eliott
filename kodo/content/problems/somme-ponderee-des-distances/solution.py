import sys


def main():
    donnees = sys.stdin.buffer.read().split()
    n = int(donnees[0])
    c = [0] + [int(x) for x in donnees[1:1 + n]]
    parent = [0, 0] + [int(x) for x in donnees[1 + n:2 * n]]
    enfants = [[] for _ in range(n + 1)]
    for v in range(2, n + 1):
        enfants[parent[v]].append(v)

    # Parcours en largeur depuis la racine : chaque sommet apparaît après son parent.
    ordre = [1]
    profondeur = [0] * (n + 1)
    for u in ordre:
        for v in enfants[u]:
            profondeur[v] = profondeur[u] + 1
            ordre.append(v)

    # poids[v] = somme des c[u] pour u dans le sous-arbre de v.
    poids = c[:]
    for v in reversed(ordre):
        if v != 1:
            poids[parent[v]] += poids[v]
    total = poids[1]

    # Racine : chaque u est à distance profondeur[u].
    reponse = [0] * (n + 1)
    reponse[1] = sum(c[u] * profondeur[u] for u in range(1, n + 1))
    # Passer du parent p à son enfant v : le sous-arbre de v se rapproche de 1,
    # tout le reste s'éloigne de 1.
    for v in ordre:
        if v != 1:
            reponse[v] = reponse[parent[v]] + total - 2 * poids[v]

    print("\n".join(map(str, reponse[1:])))


main()
