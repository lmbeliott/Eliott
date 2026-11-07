def pgcd(a, b):
    while b != 0:
        r = a % b
        a = b
        b = r
    return a


def ajouter(p, q, a, b):
    # p/q + a/b, renvoyée sous forme irréductible.
    num = p * b + a * q
    den = q * b
    d = pgcd(num, den)
    return num // d, den // d


n = int(input())
p, q = 0, 1
for i in range(n):
    a, b = map(int, input().split())
    p, q = ajouter(p, q, a, b)
print(str(p) + "/" + str(q))
