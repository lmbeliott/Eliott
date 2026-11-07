import json, random
random.seed(2026)

def f(x):
    # compte exact (pour fabriquer des tests autour des carrés et des cubes)
    from math import isqrt
    def iroot(n, k):
        r = int(round(n ** (1 / k)))
        while r ** k > n: r -= 1
        while (r + 1) ** k <= n: r += 1
        return r
    return x - isqrt(x) - iroot(x, 3) + iroot(x, 6)

def test(ks):
    return f"{len(ks)}\n" + "".join(f"{k}\n" for k in ks)

tests = [test([1, 2, 3, 4, 5, 6, 10, 100])]
tests.append(test(list(range(1, 61))))
L = 10**18
tests.append(test([L, L - 1, L - 10**9, 10**17, 10**12, 999999999999999999 // 2]))
# K tels que la réponse soit juste avant ou après un grand carré ou un grand cube
ks = []
for _ in range(25):
    s = random.randint(10**8, 999999999) ** 2
    c = random.randint(10**5, 999999) ** 3
    for v in (s - 1, s + 1, c - 1, c + 1):
        if f(v) <= L:
            ks.append(f(v))
tests.append(test(ks[:100]))
tests.append(test([random.randint(1, L) for _ in range(100)]))
tests.append(test([random.randint(1, 10**6) for _ in range(100)]))
tests.append(test([L - random.randint(0, 10**6) for _ in range(100)]))
print(json.dumps(tests))
