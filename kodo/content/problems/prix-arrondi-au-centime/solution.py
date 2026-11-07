p, t = map(int, input().split())
a = p * (100 + t)                      # prix exact × 100, en centimes
c = (2 * a + 100) // 200               # arrondi au centime, moitié vers le haut
print(f"{c / 100:.2f}")
