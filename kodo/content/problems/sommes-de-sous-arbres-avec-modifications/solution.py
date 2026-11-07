import sys


def main():
    donnees = sys.stdin.buffer.read().split()
    n, q = int(donnees[0]), int(donnees[1])
    valeur = [0] + [int(x) for x in donnees[2:n + 2]]
    enfants = [[] for _ in range(n + 1)]
    for v in range(2, n + 1):
        enfants[int(donnees[n + v])].append(v)

    # Parcours en profondeur sans récursion : debut[v] est la position de v dans l'ordre
    # de visite, fin[v] la dernière position de son sous-arbre. Le sous-arbre de v occupe
    # exactement les positions debut[v] .. fin[v].
    debut = [0] * (n + 1)
    fin = [0] * (n + 1)
    compteur = 0
    pile = [1]
    while pile:
        v = pile.pop()
        if v > 0:
            compteur += 1
            debut[v] = compteur
            pile.append(-v)  # marqueur : on repassera par v quand tout son sous-arbre sera visité
            pile.extend(enfants[v])
        else:
            fin[-v] = compteur

    # Arbre de Fenwick sur les positions : la case debut[v] contient la valeur de v.
    arbre = [0] * (n + 1)

    def ajoute(i, x):
        while i <= n:
            arbre[i] += x
            i += i & -i

    def prefixe(i):
        s = 0
        while i > 0:
            s += arbre[i]
            i -= i & -i
        return s

    for v in range(1, n + 1):
        ajoute(debut[v], valeur[v])

    sortie = []
    pos = 2 * n + 1
    for _ in range(q):
        if donnees[pos] == b"1":
            v, x = int(donnees[pos + 1]), int(donnees[pos + 2])
            pos += 3
            ajoute(debut[v], x - valeur[v])  # on ajoute la différence
            valeur[v] = x
        else:
            v = int(donnees[pos + 1])
            pos += 2
            sortie.append(prefixe(fin[v]) - prefixe(debut[v] - 1))
    print("\n".join(map(str, sortie)))


main()
