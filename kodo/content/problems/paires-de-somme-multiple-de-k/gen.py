import json, random
random.seed(2026)

tests = ["6 4\n", "10 3\n"]
tests += ["1 1\n", "2 3\n", "2 2\n", "1000 1\n", "1000 2000\n", "1000 1999\n", "1000 7\n", "999 2\n"]
for _ in range(3):
    tests.append(f"{random.randint(500, 1000)} {random.randint(1, 2000)}\n")
print(json.dumps(tests))
