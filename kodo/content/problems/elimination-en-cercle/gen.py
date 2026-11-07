import json, random
random.seed(2026)

tests = ["5 2\n", "7 3\n"]
tests += ["1 1\n", "1 1000000000\n", "6 1\n", "6 6\n", "4 1000000000\n", "2000 2\n",
          "2000 1000000000\n", "2000 1999\n", "1999 2000\n", "10 11\n"]
for _ in range(3):
    tests.append(f"{random.randint(1, 2000)} {random.randint(1, 10**9)}\n")
print(json.dumps(tests))
