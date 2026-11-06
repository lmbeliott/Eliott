def est_bissextile(a):
    # Divisible par 4, sauf les années divisibles par 100 mais pas par 400.
    return (a % 4 == 0 and a % 100 != 0) or a % 400 == 0


def jours_dans_mois(m, a):
    if m == 2:
        if est_bissextile(a):
            return 29
        return 28
    if m == 4 or m == 6 or m == 9 or m == 11:
        return 30
    return 31


def numero(j, m, a):
    # Nombre de jours écoulés depuis le 1er janvier 1900.
    total = 0
    for annee in range(1900, a):
        if est_bissextile(annee):
            total += 366
        else:
            total += 365
    for mois in range(1, m):
        total += jours_dans_mois(mois, a)
    return total + j - 1


n = int(input())
plus_long = 0
precedent = -1
for _ in range(n):
    j, m, a = map(int, input().split("/"))
    jour = numero(j, m, a)
    if precedent != -1:
        plus_long = max(plus_long, jour - precedent)
    precedent = jour

print(plus_long)
