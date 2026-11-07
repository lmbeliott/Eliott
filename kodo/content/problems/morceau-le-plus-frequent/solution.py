n, k = map(int, input().split())
s = input()

compte = {}   # sous-chaîne de longueur k -> nombre d'apparitions
for i in range(n - k + 1):
    morceau = s[i:i + k]
    compte[morceau] = compte.get(morceau, 0) + 1

meilleur = ""
nb = 0
for morceau in compte:
    c = compte[morceau]
    if c > nb or (c == nb and morceau < meilleur):
        meilleur = morceau
        nb = c
print(meilleur, nb)
