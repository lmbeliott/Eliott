import json, random
random.seed(2026)

tests = ["10 20\n", "1 100\n"]
tests += ["1 1\n", "19 19\n", "1 100000\n", "100000 100000\n", "99999 100000\n", "50000 60000\n", "1 9\n"]
for _ in range(4):
    a = random.randint(1, 100000)
    b = random.randint(a, 100000)
    tests.append(f"{a} {b}\n")
print(json.dumps(tests))
