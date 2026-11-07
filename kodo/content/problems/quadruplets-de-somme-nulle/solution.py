def lire_liste():
    return list(map(int, input().split()))

n = int(input())
a = lire_liste()
b = lire_liste()
c = lire_liste()
d = lire_liste()

# nombre de façons d'obtenir chaque somme a[i] + b[j]
sommes_ab = {}
for x in a:
    for y in b:
        sommes_ab[x + y] = sommes_ab.get(x + y, 0) + 1

# pour chaque c[k] + d[l], il faut a[i] + b[j] = -(c[k] + d[l])
total = 0
for z in c:
    for t in d:
        total = total + sommes_ab.get(-(z + t), 0)
print(total)
