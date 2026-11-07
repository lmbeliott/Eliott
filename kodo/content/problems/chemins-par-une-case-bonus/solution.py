import sys

MOD = 10 ** 9 + 7


def main():
    donnees = list(map(int, sys.stdin.buffer.read().split()))
    h, w, k, b = donnees[0], donnees[1], donnees[2], donnees[3]
    pos = 4
    points = []  # (ligne, colonne, est_un_piege)
    for t in range(k + b):
        points.append((donnees[pos], donnees[pos + 1], t < k))
        pos += 2
    points.sort()
    points.append((h, w, False))  # l'arrivée, traitée en dernier
    n = len(points)

    # Factorielles et inverses jusqu'à h + w
    m = h + w
    fact = [1] * (m + 1)
    for i in range(1, m + 1):
        fact[i] = fact[i - 1] * i % MOD
    inv = [1] * (m + 1)
    inv[m] = pow(fact[m], MOD - 2, MOD)
    for i in range(m, 0, -1):
        inv[i - 1] = inv[i] * i % MOD

    def chemins(dl, dc):
        # nombre de chemins (droite / bas) pour descendre de dl lignes et avancer de dc colonnes
        return fact[dl + dc] * inv[dl] % MOD * inv[dc] % MOD

    # sans_piege[i]  : chemins du départ à i qui n'ont croisé aucun piège avant i
    # sans_rien[i]   : chemins du départ à i qui n'ont croisé ni piège ni bonus avant i
    sans_piege = [0] * n
    sans_rien = [0] * n
    for i in range(n):
        li, ci, _ = points[i]
        total = chemins(li - 1, ci - 1)
        a = total
        r = total
        for j in range(i):
            lj, cj, piege = points[j]
            if cj <= ci:
                dl, dc = li - lj, ci - cj
                p = fact[dl + dc] * inv[dl] % MOD * inv[dc] % MOD  # chemins(dl, dc)
                # on retire les chemins dont la PREMIÈRE case spéciale (interdite) est j
                if piege:
                    a -= sans_piege[j] * p
                r -= sans_rien[j] * p
        sans_piege[i] = a % MOD
        sans_rien[i] = r % MOD

    # (évitent les pièges) - (évitent les pièges et les bonus) = (évitent les pièges, au moins un bonus)
    print((sans_piege[n - 1] - sans_rien[n - 1]) % MOD)


main()
