def somme_chiffres(n):
    s = 0
    while n > 0:
        s = s + n % 10
        n = n // 10
    return s


def racine(n):
    # On remplace n par la somme de ses chiffres tant qu'il a au moins deux chiffres.
    while n >= 10:
        n = somme_chiffres(n)
    return n


q = int(input())
for i in range(q):
    n = int(input())
    print(racine(n))
