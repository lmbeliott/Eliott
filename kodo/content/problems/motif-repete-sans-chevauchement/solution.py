import sys

MOD = (1 << 61) - 1  # grand module premier : les collisions deviennent très improbables
BASE = 911382323


def main():
    donnees = sys.stdin.read().split()
    k = int(donnees[0])
    s = donnees[1]
    n = len(s)

    # h[i] = hachage du préfixe de longueur i ; pw[i] = BASE^i
    h = [0] * (n + 1)
    pw = [1] * (n + 1)
    for i in range(n):
        h[i + 1] = (h[i] * BASE + ord(s[i])) % MOD
        pw[i + 1] = pw[i] * BASE % MOD

    def premiere_position(lg):
        # Plus petite position d'un mot de longueur lg qui a k occurrences disjointes, ou -1.
        p = pw[lg]
        hs = [(h[i + lg] - h[i] * p) % MOD for i in range(n - lg + 1)]
        derniere = {}  # hachage -> début de la dernière occurrence retenue
        nombre = {}    # hachage -> nombre d'occurrences retenues
        premiere = {}  # hachage -> première occurrence
        meilleure = -1
        for i, x in enumerate(hs):
            d = derniere.get(x)
            if d is None:
                derniere[x] = i
                nombre[x] = 1
                premiere[x] = i
                c = 1
            elif i >= d + lg:  # glouton : on retient l'occurrence dès qu'elle ne chevauche pas
                derniere[x] = i
                c = nombre[x] + 1
                nombre[x] = c
            else:
                continue
            if c == k and (meilleure == -1 or premiere[x] < meilleure):
                meilleure = premiere[x]
        return meilleure

    # Si un mot de longueur L convient, son préfixe de longueur L - 1 aussi : on dichotomise.
    bas, haut = 1, n // k  # la longueur 1 convient toujours (garanti)
    while bas < haut:
        milieu = (bas + haut + 1) // 2
        if premiere_position(milieu) != -1:
            bas = milieu
        else:
            haut = milieu - 1
    print(bas, premiere_position(bas) + 1)


main()
