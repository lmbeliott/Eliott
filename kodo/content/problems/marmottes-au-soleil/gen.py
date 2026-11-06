import json, random
random.seed(2026)

tests = ["15\n", "3\n"]
tests += ["8\n", "7\n", "9\n", "0\n", "-30\n", "40\n", "-8\n"]
for _ in range(4):
    tests.append(f"{random.randint(-30, 40)}\n")
print(json.dumps(tests))
