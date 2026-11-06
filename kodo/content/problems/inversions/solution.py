import sys


def main():
    donnees = sys.stdin.buffer.read().split()
    n = int(donnees[0])
    perm = [int(x) for x in donnees[1:1 + n]]

    # Arbre de Fenwick sur les valeurs : compte les valeurs déjà vues.
    arbre = [0] * (n + 1)

    def somme(i):  # nombre de valeurs déjà vues parmi 1..i
        s = 0
        while i > 0:
            s += arbre[i]
            i -= i & -i
        return s

    def ajoute(i):  # la valeur i vient d'être vue
        while i <= n:
            arbre[i] += 1
            i += i & -i

    total = 0
    for i, d in enumerate(perm):
        # i valeurs sont déjà vues ; celles qui sont > d forment une inversion avec d.
        total += i - somme(d)
        ajoute(d)

    print(total)


main()
