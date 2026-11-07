import json, random
random.seed(2026)

tests = ["3 4\n", "1 1\n"]
tests += ["1 30\n", "30 1\n", "30 30\n", "2 2\n", "5 5\n", "10 7\n"]
for _ in range(4):
    tests.append(f"{random.randint(1, 30)} {random.randint(1, 30)}\n")
print(json.dumps(tests))
