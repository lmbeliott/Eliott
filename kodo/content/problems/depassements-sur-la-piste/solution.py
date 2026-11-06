import sys


def main():
    donnees = sys.stdin.buffer.read().split()
    n = int(donnees[0])
    arrivee = [int(x) for x in donnees[1:1 + n]]

    # Arbre de Fenwick sur les dossards : compte les dossards déjà arrivés.
    arbre = [0] * (n + 1)

    def somme(i):  # nombre de dossards déjà arrivés parmi 1..i
        s = 0
        while i > 0:
            s += arbre[i]
            i -= i & -i
        return s

    def ajoute(i):  # le dossard i vient d'arriver
        while i <= n:
            arbre[i] += 1
            i += i & -i

    total = 0
    for i, d in enumerate(arrivee):
        # i skieurs sont déjà arrivés ; ceux de dossard > d ont dépassé d.
        total += i - somme(d)
        ajoute(d)

    print(total)


main()
