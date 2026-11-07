import sys

def somme_des_puissances(b, m, n):
    # 1 + b + ... + b^(m-1), ou n + 1 dès que la somme dépasse n
    s, p = 0, 1
    for _ in range(m):
        s += p
        if s > n:
            return n + 1
        p *= b
    return s

def plus_petite_base(n):
    for m in range(60, 2, -1):
        # invariant : S(hi) >= n, et S(b) < n pour 2 <= b <= lo
        lo, hi = 1, 2 ** (60 // (m - 1) + 1)
        while hi - lo > 1:
            mid = (lo + hi) // 2
            if somme_des_puissances(mid, m, n) >= n:
                hi = mid
            else:
                lo = mid
        if somme_des_puissances(hi, m, n) == n:
            return hi
    return n - 1          # deux chiffres : n = 1 + (n - 1)

donnees = sys.stdin.read().split()
t = int(donnees[0])
print("\n".join(str(plus_petite_base(int(donnees[1 + i]))) for i in range(t)))
