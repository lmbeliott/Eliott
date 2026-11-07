import sys

MOD = 1000000007


def main():
    donnees = sys.stdin.buffer.read().split()
    n = int(donnees[0])
    p = [0] + [int(x) for x in donnees[1:1 + n]]

    # longueurs des cycles de la permutation
    vu = [False] * (n + 1)
    longueurs = []
    for depart in range(1, n + 1):
        if not vu[depart]:
            longueur = 0
            x = depart
            while not vu[x]:
                vu[x] = True
                x = p[x]
                longueur += 1
            longueurs.append(longueur)

    # crible : plus petit facteur premier de chaque entier jusqu'à N
    ppf = list(range(n + 1))
    i = 2
    while i * i <= n:
        if ppf[i] == i:
            for j in range(i * i, n + 1, i):
                if ppf[j] == j:
                    ppf[j] = i
        i += 1

    # PPCM des longueurs : pour chaque nombre premier, le plus grand exposant rencontré
    exposant = {}
    for longueur in longueurs:
        x = longueur
        while x > 1:
            q, e = ppf[x], 0
            while x % q == 0:
                x //= q
                e += 1
            exposant[q] = max(exposant.get(q, 0), e)

    reponse = 1
    for q, e in exposant.items():
        reponse = reponse * pow(q, e, MOD) % MOD
    print(reponse)


main()
