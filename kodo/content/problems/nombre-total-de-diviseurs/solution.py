from math import isqrt

def total_jusqua(n):
    # d(1) + d(2) + ... + d(n) = nombre de couples (a, b) avec a × b <= n
    # couples avec a <= s, plus couples avec b <= s, moins ceux comptés deux fois
    s = isqrt(n)
    avec_a_petit = 0
    for a in range(1, s + 1):
        avec_a_petit += n // a
    return 2 * avec_a_petit - s * s

def main():
    l, r = map(int, input().split())
    print(total_jusqua(r) - total_jusqua(l - 1))

main()
