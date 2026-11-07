import json, random
random.seed(2026)

tests = ["10 30 125\n", "0 15 -30\n"]
tests += ["0 0 0\n", "23 59 1\n", "0 0 -1\n", "12 0 -1440\n", "12 0 1440\n",
          "5 5 -1000000000\n", "18 45 1000000000\n", "0 0 -1439\n", "23 59 -1439\n", "7 0 -2881\n"]
for _ in range(3):
    tests.append(f"{random.randint(0, 23)} {random.randint(0, 59)} {random.randint(-10**9, 10**9)}\n")
print(json.dumps(tests))
