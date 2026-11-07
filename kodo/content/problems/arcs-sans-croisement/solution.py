import sys


def main():
    donnees = sys.stdin.read().split()
    n = int(donnees[0])
    lettres = donnees[1]
    v = list(map(int, donnees[2:2 + n]))

    # memes[l] = positions k > l qui portent la même lettre que l
    memes = [[k for k in range(l + 1, n) if lettres[k] == lettres[l]] for l in range(n)]

    # f[l][r] = meilleur total en n'utilisant que les points l..r (0 si l > r)
    f = [[0] * n for _ in range(n + 2)]
    for l in range(n - 1, -1, -1):
        # Cas 1 : le point l n'est relié à rien
        ligne = f[l + 1][:]
        # Cas 2 : l est relié à k ; l'intérieur l+1..k-1 et l'extérieur k+1..r sont indépendants
        for k in memes[l]:
            base = v[l] * v[k] + (f[l + 1][k - 1] if k - 1 >= l + 1 else 0)
            dehors = f[k + 1]
            # pour tous les r >= k à la fois : ligne[r] = max(ligne[r], base + dehors[r])
            ligne[k:] = [x if x >= base + y else base + y for x, y in zip(ligne[k:], dehors[k:])]
        f[l] = ligne
    print(f[0][n - 1])


main()
