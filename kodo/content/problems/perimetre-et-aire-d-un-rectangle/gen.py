import json, random
random.seed(2026)

tests = ["5 3\n", "10 10\n"]
tests += ["1 1\n", "10000 10000\n", "1 10000\n", "10000 1\n", "7 2\n"]
for _ in range(5):
    tests.append(f"{random.randint(1, 10000)} {random.randint(1, 10000)}\n")
print(json.dumps(tests))
