import json, random
random.seed(2026)

tests = ["10\n", "15\n"]
tests += ["1\n", "2\n", "3\n", "5\n", "14\n", "30\n", "100000\n", "99999\n"]
for _ in range(3):
    tests.append(f"{random.randint(1, 100000)}\n")
print(json.dumps(tests))
