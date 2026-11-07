import json, random
random.seed(2026)

def suite(k, x, b, c, m):
    a = [x]
    for _ in range(k - 1):
        a.append((a[-1] * b + c) % m)
    return a

def test_varie(n, m):
    # paramètres au hasard, en gardant des notes assez variées
    while True:
        x, b, c = random.randrange(m), random.randrange(1, m), random.randrange(m)
        if len(set(suite(min(2 * n, 4000), x, b, c, m))) >= min(2 * n, 4000, m) // 3:
            return f"{n} {x} {b} {c} {m}\n"

tests = ["4 2 17 21 22\n", "6 1 5 3 17\n"]
tests.append("2 0 0 0 1\n")            # toutes les notes nulles
tests.append("3 1 1 1 1000\n")         # notes 1, 2, 3, 4, 5, 6 : aucun désaccord
tests.append("5 9 1 999 1000\n")       # notes 9, 8, 7, ... : le second juge suit le premier
tests.append(test_varie(30, 5))
tests.append(test_varie(2000, 1000000000))
tests.append(test_varie(50000, 100))
for m in [1000000000, 999999937, 65536]:
    tests.append(test_varie(100000, m))
print(json.dumps(tests))
