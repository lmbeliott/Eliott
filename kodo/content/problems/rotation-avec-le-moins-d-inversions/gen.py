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

tests = ["4 3 1 1 4\n", "6 7 3 5 11\n"]
tests.append("1 5 3 2 10\n")
tests.append("5 4 0 4 10\n")                  # tout égal
tests.append("10 9 1 999999999 1000000000\n") # 9, 8, ..., 0 : décroissante
tests.append("10 3 1 1 10\n")                 # 3, 4, ..., 9, 0, 1, 2
tests.append(test_varie(40, 7))
tests.append(test_varie(3000, 1000000000))
for m in [1000000000, 999999937, 100]:
    tests.append(test_varie(100000, m))
tests.append("100000 0 1 1 100000\n")          # 0, 1, ..., 99999 : déjà triée
print(json.dumps(tests))
