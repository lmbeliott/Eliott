import sys

donnees = sys.stdin.read().split()
n, m = int(donnees[0]), int(donnees[1])
couvre = []
pos = 2
for i in range(n):
    l = int(donnees[pos])
    masque = 0
    for q in donnees[pos + 1:pos + 1 + l]:
        masque |= 1 << (int(q) - 1)
    couvre.append(masque)
    pos += 1 + l

tout = (1 << m) - 1
union = [0] * (1 << n)
taille = [0] * (1 << n)
for masque in range(1, 1 << n):
    bas = masque & -masque              # bit le plus bas
    i = bas.bit_length() - 1
    union[masque] = union[masque - bas] | couvre[i]
    taille[masque] = taille[masque - bas] + 1

k = n + 1
for masque in range(1 << n):
    if union[masque] == tout and taille[masque] < k:
        k = taille[masque]
if k == n + 1:
    print(-1)
else:
    nb = sum(1 for masque in range(1 << n) if union[masque] == tout and taille[masque] == k)
    print(k, nb)
