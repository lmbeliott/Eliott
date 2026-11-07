n, m, k = map(int, input().split())
total = 0
for h in range(1, n + 1):          # hauteur du rectangle
    for w in range(1, m + 1):      # largeur du rectangle
        if h * w <= k:
            # nombre de places pour un rectangle h × w
            total = total + (n - h + 1) * (m - w + 1)
print(total)
