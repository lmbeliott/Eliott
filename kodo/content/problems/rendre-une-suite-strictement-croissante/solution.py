import sys
from bisect import bisect_right


def main():
    donnees = sys.stdin.buffer.read().split()
    n = int(donnees[0])
    # On garde a[i] (i compté à partir de 1) seulement si a[i] - i >= 0 ; les valeurs gardées
    # doivent alors former une sous-suite croissante au sens large de b[i] = a[i] - i.
    fins = []  # fins[L-1] = plus petite fin possible d'une sous-suite de longueur L
    for i in range(1, n + 1):
        b = int(donnees[i]) - i
        if b < 0:
            continue  # il n'y a pas assez d'entiers >= 1 pour placer les valeurs d'avant
        p = bisect_right(fins, b)  # bisect_right : les égalités sont permises
        if p == len(fins):
            fins.append(b)
        else:
            fins[p] = b
    print(n - len(fins))


main()
