def est_premier(n):
    # 0 et 1 ne sont pas premiers.
    if n < 2:
        return False
    # Un diviseur, s'il existe, est trouvé avant que d * d dépasse n.
    d = 2
    while d * d <= n:
        if n % d == 0:
            return False
        d += 1
    return True


a, b = map(int, input().split())
paires = 0
# p va de A à B - 2, pour que p + 2 reste au plus égal à B.
for p in range(a, b - 1):
    if est_premier(p) and est_premier(p + 2):
        paires += 1
print(paires)
