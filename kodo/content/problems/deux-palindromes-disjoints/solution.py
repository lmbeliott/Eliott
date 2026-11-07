import sys


def manacher(s):
    # t = #a#b#c# ; p[i] = rayon du plus long palindrome de t centré en i
    t = "#" + "#".join(s) + "#"
    m = len(t)
    p = [0] * m
    c, d = 0, 0  # palindrome [c - p[c], d] qui va le plus loin à droite
    for i in range(m):
        if i < d:
            p[i] = min(d - i, p[2 * c - i])
        a, b = i - p[i] - 1, i + p[i] + 1
        while a >= 0 and b < m and t[a] == t[b]:
            p[i] += 1
            a -= 1
            b += 1
        if i + p[i] > d:
            c, d = i, i + p[i]
    return p


def main():
    s = sys.stdin.readline().strip()
    n = len(s)
    p = manacher(s)

    # fin[e] = plus long palindrome qui finit en e ; debut[x] = plus long qui commence en x
    fin = [1] * n
    debut = [1] * n
    for i, longueur in enumerate(p):
        if longueur > 0:
            x = (i - longueur) // 2
            e = x + longueur - 1
            if longueur > fin[e]:
                fin[e] = longueur
            if longueur > debut[x]:
                debut[x] = longueur
    # Un palindrome qui finit en e + 1, raccourci d'une lettre de chaque côté, finit en e.
    for e in range(n - 2, -1, -1):
        if fin[e + 1] - 2 > fin[e]:
            fin[e] = fin[e + 1] - 2
    for x in range(1, n):
        if debut[x - 1] - 2 > debut[x]:
            debut[x] = debut[x - 1] - 2

    # gauche[i] = meilleur palindrome dans s[0..i] ; droite[i] = meilleur dans s[i..n-1]
    gauche = fin[:]
    for i in range(1, n):
        if gauche[i - 1] > gauche[i]:
            gauche[i] = gauche[i - 1]
    droite = debut[:]
    for i in range(n - 2, -1, -1):
        if droite[i + 1] > droite[i]:
            droite[i] = droite[i + 1]

    print(max(gauche[i] * droite[i + 1] for i in range(n - 1)))


main()
