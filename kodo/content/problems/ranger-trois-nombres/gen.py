import json, random
random.seed(2026)

tests = ["5 9 1\n", "3 3 -2\n"]
for p in ["1 2 3", "1 3 2", "2 1 3", "2 3 1", "3 1 2", "3 2 1"]:
    tests.append(p + "\n")
tests += ["7 7 7\n", "4 -4 4\n", "1000000 -1000000 0\n", "-1 -1 -5\n"]
for _ in range(3):
    tests.append(" ".join(str(random.randint(-10**6, 10**6)) for _ in range(3)) + "\n")
print(json.dumps(tests))
