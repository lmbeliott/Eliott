import sys


def main():
    donnees = sys.stdin.buffer.read().split()
    n = int(donnees[0])
    a = [int(x) for x in donnees[1:n + 1]]

    # Compression : chaque valeur est remplacée par son rang (1, 2, 3…) parmi les valeurs distinctes.
    rang = {v: i + 1 for i, v in enumerate(sorted(set(a)))}
    r = [rang[v] for v in a]
    k = len(rang)

    # plus_petits_a_gauche[j] = nombre de i < j avec a[i] < a[j], grâce à un arbre de Fenwick.
    arbre = [0] * (k + 1)
    plus_petits_a_gauche = [0] * n
    for j in range(n):
        x = r[j] - 1  # somme des compteurs des rangs 1 .. r[j] - 1
        s = 0
        while x > 0:
            s += arbre[x]
            x -= x & -x
        plus_petits_a_gauche[j] = s
        x = r[j]
        while x <= k:
            arbre[x] += 1
            x += x & -x

    # Même chose de droite à gauche : nombre de k > j avec a[k] > a[j].
    arbre = [0] * (k + 1)
    total = 0
    for j in range(n - 1, -1, -1):
        x = r[j]  # nombre de valeurs déjà vues (à droite) de rang <= r[j]
        s = 0
        while x > 0:
            s += arbre[x]
            x -= x & -x
        plus_grands_a_droite = (n - 1 - j) - s
        total += plus_petits_a_gauche[j] * plus_grands_a_droite
        x = r[j]
        while x <= k:
            arbre[x] += 1
            x += x & -x

    print(total)


main()
