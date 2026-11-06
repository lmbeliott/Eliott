import sys
from bisect import bisect_left


def main():
    donnees = sys.stdin.buffer.read().split()
    n = int(donnees[0])
    points = [(int(donnees[1 + 2 * i]), int(donnees[2 + 2 * i])) for i in range(n)]

    # X croissant, et Y décroissant à X égal :
    # deux points de même X ne pourront jamais se suivre.
    points.sort(key=lambda p: (p[0], -p[1]))

    # fin[k] = plus petit Y final d'une sous-suite strictement croissante de longueur k + 1.
    fin = []
    for _, y in points:
        k = bisect_left(fin, y)  # première position où fin[k] >= y
        if k == len(fin):
            fin.append(y)
        else:
            fin[k] = y

    print(len(fin))


main()
