import sys

def fib(n, m):
    # renvoie (F(n) mod m, F(n + 1) mod m)
    if n == 0:
        return 0, 1 % m
    a, b = fib(n // 2, m)            # F(k), F(k + 1) avec k = n // 2
    c = a * (2 * b - a) % m          # F(2k)
    d = (a * a + b * b) % m          # F(2k + 1)
    if n % 2 == 0:
        return c, d
    return d, (c + d) % m

donnees = sys.stdin.read().split()
t = int(donnees[0])
reponses = []
for i in range(t):
    n, m = int(donnees[1 + 2 * i]), int(donnees[2 + 2 * i])
    reponses.append(str(fib(n, m)[0]))
print("\n".join(reponses))
