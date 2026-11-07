import sys

MOD = (1 << 61) - 1  # grand module premier : les collisions deviennent très improbables
BASE = 1000003


def main():
    donnees = sys.stdin.buffer.read().split()
    s = donnees[0]
    n = len(s)
    q = int(donnees[1])

    # Hachages des préfixes et puissances de la base
    h = [0] * (n + 1)
    pw = [1] * (n + 1)
    for i in range(n):
        h[i + 1] = (h[i] * BASE + s[i]) % MOD
        pw[i + 1] = pw[i] * BASE % MOD

    # ppd[x] = plus petit diviseur premier de x (crible)
    ppd = list(range(n + 1))
    for p in range(2, int(n ** 0.5) + 1):
        if ppd[p] == p:
            for m in range(p * p, n + 1, p):
                if ppd[m] == m:
                    ppd[m] = p

    sortie = []
    for k in range(q):
        l = int(donnees[2 + 2 * k]) - 1
        r = int(donnees[3 + 2 * k])  # morceau s[l:r]
        longueur = r - l
        t = longueur
        x = longueur
        while x > 1:
            p = ppd[x]
            while x % p == 0:
                x //= p
            # On retire le facteur p tant que t / p reste une période du morceau.
            while t % p == 0:
                d = t // p
                # période d  <=>  s[l : r-d] == s[l+d : r], comparés par hachage
                a = (h[r - d] - h[l] * pw[longueur - d]) % MOD
                b = (h[r] - h[l + d] * pw[longueur - d]) % MOD
                if a != b:
                    break
                t = d
        sortie.append(t)
    print("\n".join(map(str, sortie)))


main()
