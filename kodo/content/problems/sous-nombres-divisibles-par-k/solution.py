k = int(input())
d = input()
n = len(d)

total = 0
for j in range(n):
    c = ord(d[j]) - ord("0")
    if c % k == 0:                                    # morceau d'un chiffre
        total += 1
    if j >= 1:
        b = ord(d[j - 1]) - ord("0")
        if (10 * b + c) % k == 0:                     # morceau de deux chiffres
            total += 1
        if j >= 2:
            a = ord(d[j - 2]) - ord("0")
            if (100 * a + 10 * b + c) % k == 0:      # les j - 1 morceaux plus longs
                total += j - 1
print(total)
