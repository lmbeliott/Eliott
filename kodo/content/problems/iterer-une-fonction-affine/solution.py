t = int(input())
for _ in range(t):
    m, a, b, x, k = map(int, input().split())
    # invariant : le résultat cherché est g appliquée k fois à x, avec g(y) = (a*y + b) % m
    while k > 0:
        if k % 2 == 1:
            x = (a * x + b) % m          # appliquer g une fois
            k -= 1
        a, b = a * a % m, (a * b + b) % m   # g devient g∘g
        k //= 2
    print(x)
