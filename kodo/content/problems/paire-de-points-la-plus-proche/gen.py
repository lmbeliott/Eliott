import json, random
random.seed(2026)

def suite(k, x, b, c, m):
    u = [x]
    for _ in range(k - 1):
        u.append((u[-1] * b + c) % m)
    return u

def test_varie(n, m):
    while True:
        x, b, c = random.randrange(m), random.randrange(1, m), random.randrange(m)
        if len(set(suite(min(2 * n, 4000), x, b, c, m))) >= min(2 * n, 4000, m) // 3:
            return f"{n} {x} {b} {c} {m}\n"

tests = ["3 1 2 3 10\n", "6 3 5 7 101\n"]
tests.append("2 0 0 0 1\n")                       # deux points confondus
tests.append("2 0 1 999999999 1000000000\n")      # (0, 999999999) et (999999998, 999999997)
tests.append("2 5 1 1 1000000000\n")              # (5, 6) et (7, 8)
tests.append(test_varie(20, 1000))
tests.append(test_varie(2000, 1000000000))
tests.append(test_varie(70000, 1000000000))
tests.append(test_varie(70000, 999999937))
tests.append(test_varie(70000, 300000))
tests.append("70000 0 1 1 1000000000\n")          # points (2k, 2k + 1) alignés
print(json.dumps(tests))
