import sys

def main():
    donnees = sys.stdin.read().split()
    m, k, q = int(donnees[0]), int(donnees[1]), int(donnees[2])
    motif = donnees[3:3 + m]

    # cote[t] : côté de la grille d'ordre t ; total[t] : son nombre de cases pleines
    nb_motif = sum(ligne.count('#') for ligne in motif)
    cote, total = [1], [1]
    for t in range(1, k + 1):
        cote.append(cote[-1] * m)
        total.append(total[-1] * nb_motif)

    # avant[i][j] : nombre de '#' du motif dans les lignes < i et les colonnes < j
    avant = [[0] * (m + 1) for _ in range(m + 1)]
    for i in range(m):
        for j in range(m):
            avant[i + 1][j + 1] = (avant[i][j + 1] + avant[i + 1][j] - avant[i][j]
                                   + (motif[i][j] == '#'))

    memo = {}

    def pleines(t, r, c):
        # cases pleines dans les r premières lignes et les c premières colonnes
        # de la grille d'ordre t (0 <= r, c <= cote[t])
        if r == 0 or c == 0:
            return 0
        if r == cote[t] and c == cote[t]:
            return total[t]
        if (t, r, c) in memo:
            return memo[(t, r, c)]
        s = cote[t - 1]
        br, rr = divmod(r, s)     # br blocs entiers en hauteur, puis rr lignes en plus
        bc, rc = divmod(c, s)
        res = avant[br][bc] * total[t - 1]                 # les blocs entiers
        if rr > 0:
            # bande du bas : les blocs (br, j < bc) sont tous coupés de la même façon
            nb = avant[br + 1][bc] - avant[br][bc]
            if nb > 0:
                res += nb * pleines(t - 1, rr, s)
        if rc > 0:
            # bande de droite : les blocs (i < br, bc)
            nb = avant[br][bc + 1] - avant[br][bc]
            if nb > 0:
                res += nb * pleines(t - 1, s, rc)
        if rr > 0 and rc > 0 and motif[br][bc] == '#':
            res += pleines(t - 1, rr, rc)                 # le bloc du coin
        memo[(t, r, c)] = res
        return res

    sortie = []
    pos = 3 + m
    for _ in range(q):
        l1, c1, l2, c2 = (int(x) for x in donnees[pos:pos + 4])
        pos += 4
        sortie.append(pleines(k, l2, c2) - pleines(k, l1 - 1, c2)
                      - pleines(k, l2, c1 - 1) + pleines(k, l1 - 1, c1 - 1))
    print("\n".join(map(str, sortie)))

main()
