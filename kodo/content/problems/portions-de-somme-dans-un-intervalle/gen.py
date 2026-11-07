import json, random
random.seed(2026)

def suite(n, x, b, c, m):
    u = [x]
    for _ in range(n - 1):
        u.append((u[-1] * b + c) % m)
    return u

def params(n, m):
    while True:
        x, b, c = random.randrange(m), random.randrange(1, m), random.randrange(m)
        if len(set(suite(min(n, 3000), x, b, c, m))) >= min(n, 3000, m) // 3:
            return x, b, c

def test(n, l, r, x, b, c, m, d):
    return f"{n} {l} {r}\n{x} {b} {c} {m} {d}\n"

tests = [test(4, 0, 2, 1, 3, 2, 7, 3), test(8, -5, 5, 4, 5, 6, 17, 8)]
tests.append(test(1, 0, 0, 0, 0, 0, 1, 0))
tests.append(test(1, -10, -1, 3, 1, 0, 10, 5))
tests.append(test(6, 5, 5, 0, 1, 1, 10, 0))         # 0, 1, 2, 3, 4, 5
tests.append(test(30, -10**14, 10**14, 7, 1, 0, 10, 2))
tests.append(test(50, 0, 0, *params(50, 3), 3, 1))   # valeurs -1, 0, 1
tests.append(test(3000, -1000, 1000, *params(3000, 1000), 1000, 500))
for (l, r, m, d) in [(-10**6, 10**6, 10**9, 5 * 10**8), (0, 10**12, 10**9, 4 * 10**8), (-50, 50, 101, 50)]:
    tests.append(test(100000, l, r, *params(100000, m), m, d))
print(json.dumps(tests))
