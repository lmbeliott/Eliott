import sys
sys.setrecursionlimit(10000)

n = int(input())

# diviseurs de n supérieurs ou égaux à 2, dans l'ordre croissant
petits, grands = [], []
d = 1
while d * d <= n:
    if n % d == 0:
        petits.append(d)
        if d * d != n:
            grands.append(n // d)
    d += 1
div = (petits + grands[::-1])[1:]

def compter(reste, i):
    # façons d'écrire reste (> 1) comme produit de facteurs distincts
    # pris parmi div[i], div[i + 1], ... (dans l'ordre croissant)
    total = 1                        # reste lui-même, comme dernier facteur
    j = i
    while div[j] * div[j] < reste:   # il faut encore un facteur plus grand après div[j]
        if reste % div[j] == 0:
            total += compter(reste // div[j], j + 1)
        j += 1
    return total

print(compter(n, 0))
