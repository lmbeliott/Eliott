import json, random
random.seed(2026)

tests = ["10 10\n", "10 3\n"]
tests += ["1 1\n", "2 1\n", "2 2\n", "100 100\n", "100000 100000\n", "100000 1\n",
          "100000 2\n", "99999 50000\n", "1000 999\n"]
for _ in range(3):
    n = random.randint(1, 100000)
    tests.append(f"{n} {random.randint(1, n)}\n")
print(json.dumps(tests))
