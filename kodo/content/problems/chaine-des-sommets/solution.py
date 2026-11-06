import sys
from bisect import bisect_left


def main():
    donnees = sys.stdin.buffer.read().split()
    n = int(donnees[0])
    sommets = [(int(donnees[1 + 2 * i]), int(donnees[2 + 2 * i])) for i in range(n)]

    # Altitude croissante, et difficulté décroissante à altitude égale :
    # deux sommets de même altitude ne pourront jamais se suivre.
    sommets.sort(key=lambda s: (s[0], -s[1]))

    # fin[k] = plus petite difficulté finale d'une sous-suite strictement croissante de longueur k + 1.
    fin = []
    for _, d in sommets:
        k = bisect_left(fin, d)  # première position où fin[k] >= d
        if k == len(fin):
            fin.append(d)
        else:
            fin[k] = d

    print(len(fin))


main()
