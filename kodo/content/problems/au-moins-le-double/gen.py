import json, random
random.seed(2026)

def suite(n, x, b, c, m):
    a = [x]
    for _ in range(n - 1):
        a.append((a[-1] * b + c) % m)
    return a

def test_varie(n, m):
    # paramètres tirés au hasard, en gardant une suite assez variée
    while True:
        x, b, c = random.randrange(m), random.randrange(1, m), random.randrange(m)
        if len(set(suite(min(n, 3000), x, b, c, m))) >= min(n, 3000, m) // 3:
            return f"{n} {x} {b} {c} {m}\n"

tests = ["5 2 3 5 7\n", "6 5 7 3 20\n"]
tests.append("2 0 0 0 1\n")                 # deux zéros
tests.append("2 5 1 0 10\n")                # deux valeurs égales et non nulles
tests.append("10 1 2 0 1000000000\n")       # 1, 2, 4, 8, ... : toutes les paires conviennent
tests.append("50 7 0 7 100\n")              # toutes les valeurs égales à 7
tests.append(test_varie(1000, 50))
tests.append(test_varie(5000, 1000000000))
tests.append(test_varie(60000, 30))
for m in [1000000000, 999999937, 1000]:
    tests.append(test_varie(200000, m))
print(json.dumps(tests))
