memo = {0: 0}    # memo[n] = meilleure valeur à partir d'un jeton n

def v(n):
    if n in memo:
        return memo[n]
    r = max(n, v(n // 2) + v(n // 3) + v(n // 5))
    memo[n] = r
    return r

q = int(input())
for _ in range(q):
    print(v(int(input())))
