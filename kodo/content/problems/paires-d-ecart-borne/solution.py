import sys
from bisect import bisect_left, bisect_right


def main():
    donnees = sys.stdin.buffer.read().split()
    n, bas, haut = int(donnees[0]), int(donnees[1]), int(donnees[2])
    a = [int(x) for x in donnees[3:3 + n]]

    # Compression : la valeur valeurs[k] correspond à la case k + 1 de l'arbre de Fenwick.
    valeurs = sorted(set(a))
    m = len(valeurs)
    arbre = [0] * (m + 1)

    def ajoute(i):  # une valeur de plus dans la case i
        while i <= m:
            arbre[i] += 1
            i += i & -i

    def somme(i):  # nombre de valeurs déjà vues dans les cases 1 à i
        s = 0
        while i > 0:
            s += arbre[i]
            i -= i & -i
        return s

    total = 0
    for x in a:
        # Les a[i] déjà vus qui conviennent sont ceux de [x - haut, x - bas].
        debut = bisect_left(valeurs, x - haut)   # cases debut + 1, debut + 2, ...
        fin = bisect_right(valeurs, x - bas)     # ... jusqu'à la case fin
        if fin > debut:
            total += somme(fin) - somme(debut)
        ajoute(bisect_left(valeurs, x) + 1)
    print(total)


main()
