import sys

INFINI = 10 ** 18


def main():
    donnees = sys.stdin.read().split()
    m = int(donnees[0])
    # d[x][y] : coût minimal pour transformer la lettre x en la lettre y
    d = [[0 if x == y else INFINI for y in range(26)] for x in range(26)]
    pos = 1
    for _ in range(m):
        x, y, c = ord(donnees[pos]) - 97, ord(donnees[pos + 1]) - 97, int(donnees[pos + 2])
        pos += 3
        d[x][y] = min(d[x][y], c)
    s, t = donnees[pos], donnees[pos + 1]

    # Floyd-Warshall sur les 26 lettres
    for k in range(26):
        for i in range(26):
            for j in range(26):
                if d[i][k] + d[k][j] < d[i][j]:
                    d[i][j] = d[i][k] + d[k][j]

    # rendre égales les lettres a et b : les transformer toutes deux en une même lettre z
    egaliser = [[min(d[a][z] + d[b][z] for z in range(26)) for b in range(26)] for a in range(26)]

    total = 0
    for a, b in zip(s, t):
        c = egaliser[ord(a) - 97][ord(b) - 97]
        if c >= INFINI:
            print(-1)
            return
        total += c
    print(total)


main()
