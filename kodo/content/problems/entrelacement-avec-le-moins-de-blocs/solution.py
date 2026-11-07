def main():
    u = input().strip()
    v = input().strip()
    n, m = len(u), len(v)
    INF = 10**9
    # fin_u[i][j] : nombre minimal de blocs d'un entrelacement de u[:i] et v[:j] qui se termine par u[i-1]
    # fin_v[i][j] : pareil, mais l'entrelacement se termine par v[j-1]
    fin_u = [[INF] * (m + 1) for _ in range(n + 1)]
    fin_v = [[INF] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        for j in range(m + 1):
            if i > 0:
                c = u[i - 1]
                if i == 1 and j == 0:
                    fin_u[i][j] = 1
                else:
                    # la lettre précédente est u[i-2] ou v[j-1]
                    meilleur = INF
                    if i >= 2:
                        meilleur = fin_u[i - 1][j] + (u[i - 2] != c)
                    if j >= 1:
                        meilleur = min(meilleur, fin_v[i - 1][j] + (v[j - 1] != c))
                    fin_u[i][j] = meilleur
            if j > 0:
                c = v[j - 1]
                if i == 0 and j == 1:
                    fin_v[i][j] = 1
                else:
                    meilleur = INF
                    if j >= 2:
                        meilleur = fin_v[i][j - 1] + (v[j - 2] != c)
                    if i >= 1:
                        meilleur = min(meilleur, fin_u[i][j - 1] + (u[i - 1] != c))
                    fin_v[i][j] = meilleur
    print(min(fin_u[n][m], fin_v[n][m]))

main()
