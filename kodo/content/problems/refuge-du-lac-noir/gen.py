import json, random
random.seed(2026)

tests = ["3 4\n", "12 0\n"]
tests += ["0 0\n", "1000 1000\n", "0 1000\n", "999 1\n"]
for _ in range(4):
    tests.append(f"{random.randint(0, 1000)} {random.randint(0, 1000)}\n")
print(json.dumps(tests))
