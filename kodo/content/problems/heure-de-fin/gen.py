import json, random
random.seed(2026)

tests = ["21 30 45\n", "23 10 125\n"]
tests += ["0 0 0\n", "23 59 1\n", "5 5 55\n", "12 0 1000\n", "23 59 1000\n", "0 0 1000\n", "22 0 120\n", "7 45 0\n"]
for _ in range(4):
    tests.append(f"{random.randint(0, 23)} {random.randint(0, 59)} {random.randint(0, 1000)}\n")
print(json.dumps(tests))
