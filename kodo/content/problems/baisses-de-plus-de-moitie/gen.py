import json, random
random.seed(2026)

def suite(n, x, b, c, m):
    a = [x]
    for _ in range(n - 1):
        a.append((a[-1] * b + c) % m)
    return a

def test_varie(n, m):
    while True:
        x, b, c = random.randrange(m), random.randrange(1, m), random.randrange(m)
        if len(set(suite(min(n, 3000), x, b, c, m))) >= min(n, 3000, m) // 3:
            return f"{n} {x} {b} {c} {m}\n"

tests = ["5 11 21 33 37\n", "8 40 7 11 97\n"]
tests.append("2 0 0 0 1\n")
tests.append("2 3 1 0 10\n")                 # 3, 3 : aucune baisse
tests.append("2 5 0 2 10\n")                 # 5, 2 : 4 < 5, une baisse
tests.append("30 1000000 0 0 1000000000\n")  # 1000000 puis des 0
tests.append("29 1 2 0 1000000000\n")        # prix qui doublent : aucune baisse
tests.append(test_varie(50, 20))
tests.append(test_varie(3000, 1000000000))
for m in [1000000000, 999999937, 1000]:
    tests.append(test_varie(100000, m))
print(json.dumps(tests))
