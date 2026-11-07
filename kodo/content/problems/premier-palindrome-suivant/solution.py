def renverser(n):
    r = 0
    while n > 0:
        r = r * 10 + n % 10
        n = n // 10
    return r


def est_palindrome(n):
    return renverser(n) == n


def est_premier(n):
    if n < 2:
        return False
    d = 2
    while d * d <= n:
        if n % d == 0:
            return False
        d = d + 1
    return True


n = int(input())
# Le test de palindrome, rapide, est fait en premier.
while not (est_palindrome(n) and est_premier(n)):
    n = n + 1
print(n)
