def somme_diviseurs_propres(n):
    s = 0
    d = 1
    while d * d <= n:
        if n % d == 0:
            s = s + d
            if d * d != n:       # l'autre diviseur de la paire, s'il est différent
                s = s + n // d
        d = d + 1
    return s - n                 # n lui-même n'est pas un diviseur propre


def classer(n):
    s = somme_diviseurs_propres(n)
    if s == n:
        return "PARFAIT"
    elif s > n:
        return "ABONDANT"
    else:
        return "DEFICIENT"


q = int(input())
for i in range(q):
    print(classer(int(input())))
