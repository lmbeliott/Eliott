import sys

MONTE, DESCEND = 0, 1  # sens imposé au prochain chiffre : plus grand / plus petit


def main():
    donnees = sys.stdin.read().split()
    m, t = int(donnees[0]), int(donnees[1])
    LMAX = 19

    p10 = [1 % m] * (LMAX + 1)  # p10[i] = 10^i modulo m
    for i in range(1, LMAX + 1):
        p10[i] = p10[i - 1] * 10 % m

    # g[L][d][s][r] = nombre de suites de L chiffres qui peuvent suivre le chiffre d,
    # dont le premier pas va dans le sens s, et dont la valeur vaut r modulo m.
    # Ce tableau ne dépend pas des bornes : on le calcule une seule fois.
    vide = [0] * m
    vide[0] = 1
    g = [[[vide, vide] for _ in range(10)]]
    for L in range(1, LMAX):
        p = p10[L - 1]
        # tourne[e][s] : suites de longueur L qui commencent par e, puis vont dans le sens s
        tourne = []
        for e in range(10):
            dec = e * p % m
            paire = []
            for s in (MONTE, DESCEND):
                src = g[L - 1][e][s]
                paire.append(src[m - dec:] + src[:m - dec])  # valeur + e × 10^(L-1)
            tourne.append(paire)
        ligne = [[None, None] for _ in range(10)]
        # Après d en montant : premier chiffre e > d, puis on doit descendre (sommes cumulées)
        acc = [0] * m
        for d in range(9, -1, -1):
            ligne[d][MONTE] = acc
            acc = [a + b for a, b in zip(acc, tourne[d][DESCEND])]
        acc = [0] * m
        for d in range(10):
            ligne[d][DESCEND] = acc
            acc = [a + b for a, b in zip(acc, tourne[d][MONTE])]
        g.append(ligne)

    def compte(n):
        # nombre d'entiers en zigzag dans [1, n] multiples de m
        if n <= 0:
            return 0
        ch = list(map(int, str(n)))
        k = len(ch)
        total = 0
        # 1) les nombres qui ont moins de k chiffres
        for lg in range(1, k):
            for f in range(1, 10):
                if lg == 1:
                    total += f % m == 0
                else:
                    cible = -f * p10[lg - 1] % m
                    total += g[lg - 1][f][MONTE][cible] + g[lg - 1][f][DESCEND][cible]
        # 2) les nombres de k chiffres : on suit les chiffres de n, puis on passe en dessous
        pref = 0
        for i in range(k):
            for c in range(1 if i == 0 else 0, ch[i] + 1):
                # le préfixe ch[0..i-1] suivi de c doit rester en zigzag
                if i >= 1 and c == ch[i - 1]:
                    continue
                if i >= 2 and (c > ch[i - 1]) == (ch[i - 1] > ch[i - 2]):
                    continue
                if c == ch[i]:
                    break
                reste = k - 1 - i
                v = (pref * 10 + c) % m
                if reste == 0:
                    total += v == 0
                else:
                    cible = -v * p10[reste] % m
                    if i == 0:
                        total += g[reste][c][MONTE][cible] + g[reste][c][DESCEND][cible]
                    else:
                        sens = DESCEND if c > ch[i - 1] else MONTE
                        total += g[reste][c][sens][cible]
            else:
                return total  # le chiffre ch[i] casse le zigzag : n et la suite sont exclus
            pref = (pref * 10 + ch[i]) % m
        return total + (pref == 0)  # n lui-même

    sortie = []
    for q in range(t):
        a, b = int(donnees[2 + 2 * q]), int(donnees[3 + 2 * q])
        sortie.append(compte(b) - compte(a - 1))
    print("\n".join(map(str, sortie)))


main()
