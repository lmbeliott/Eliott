n, k = map(int, input().split())
s = k * (k + 1) // 2  # plus petite somme de K entiers positifs distincts : 1 + 2 + ... + K

meilleur = -1
d = 1
while d * d <= n:  # on parcourt les diviseurs par paires (d, n // d)
    if n % d == 0:
        for g in (d, n // d):
            if n // g >= s:  # comparer N / g à s évite de calculer g × s, qui peut être énorme
                meilleur = max(meilleur, g)
    d += 1
print(meilleur)
