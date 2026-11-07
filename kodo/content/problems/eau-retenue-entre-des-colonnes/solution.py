n = int(input())
h = list(map(int, input().split()))

# gauche[i] : plus haute colonne parmi 0..i ; droite[i] : parmi i..n-1
gauche = [0] * n
gauche[0] = h[0]
for i in range(1, n):
    gauche[i] = max(gauche[i - 1], h[i])
droite = [0] * n
droite[n - 1] = h[n - 1]
for i in range(n - 2, -1, -1):
    droite[i] = max(droite[i + 1], h[i])

eau = 0
for i in range(n):
    eau += min(gauche[i], droite[i]) - h[i]
print(eau)
