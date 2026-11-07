n, k = map(int, input().split())
t = list(map(int, input().split()))

cpt = [0] * k   # cpt[r] : valeurs déjà lues de reste r
total = 0
for x in t:
    r = x % k
    total += cpt[(k - r) % k]   # partenaires lus avant x
    cpt[r] += 1
print(total)
