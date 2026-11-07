import json, random
random.seed(2026)

tests = ["2024\n", "1900\n", "2000\n"]
tests += ["2023\n", "1\n", "4\n", "100\n", "400\n", "100000\n", "99996\n", "99999\n", "2100\n"]
for _ in range(3):
    tests.append(f"{random.randint(1, 100000)}\n")
print(json.dumps(tests))
