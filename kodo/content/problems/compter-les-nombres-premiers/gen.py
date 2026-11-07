import json, random
random.seed(2026)

tests = ["20\n", "2\n"]
tests += ["3\n", "4\n", "100\n", "121\n", "30000\n", "29989\n", "29988\n", "1000\n"]
for _ in range(3):
    tests.append(f"{random.randint(2, 30000)}\n")
print(json.dumps(tests))
