import sys
sys.setrecursionlimit(10000)

def lire_texte(i):
    # lit le texte qui commence à la position i, jusqu'à une ')' ou la fin
    # renvoie (liste des morceaux, longueur développée, position atteinte)
    # un morceau est ("lettre", l) ou ("groupe", répétitions, morceaux du groupe, longueur du groupe)
    morceaux = []
    longueur = 0
    while i < len(s) and s[i] != ")":
        if s[i].isdigit():
            j = i
            while s[j].isdigit():
                j = j + 1
            c = int(s[i:j])
            groupe, lg, i = lire_texte(j + 1)   # j est la position de '('
            i = i + 1                            # saute ')'
            morceaux.append(("groupe", c, groupe, lg))
            longueur = longueur + c * lg
        else:
            morceaux.append(("lettre", s[i]))
            longueur = longueur + 1
            i = i + 1
    return morceaux, longueur, i

def chercher(morceaux, k):
    # k-ième lettre (k >= 1) du texte développé décrit par morceaux
    for m in morceaux:
        if m[0] == "lettre":
            if k == 1:
                return m[1]
            k = k - 1
        else:
            nature, c, groupe, lg = m
            if k <= c * lg:
                return chercher(groupe, (k - 1) % lg + 1)
            k = k - c * lg

s = input().strip()
texte, total, fin = lire_texte(0)
q = int(input())
for _ in range(q):
    print(chercher(texte, int(input())))
