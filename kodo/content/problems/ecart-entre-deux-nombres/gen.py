import json, random
random.seed(2026)

tests = ["3 10\n", "12 5\n", "-3 4\n"]
tests += ["0 0\n", "7 7\n", "-1000000 1000000\n", "1000000 -1000000\n", "-5 -9\n", "-9 -5\n"]
for _ in range(4):
    tests.append(f"{random.randint(-10**6, 10**6)} {random.randint(-10**6, 10**6)}\n")
print(json.dumps(tests))
