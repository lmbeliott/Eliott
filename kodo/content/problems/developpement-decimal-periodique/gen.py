import json, random
random.seed(2026)

tests = ["22 7\n", "1 6\n", "7 4\n"]
tests += ["0 5\n", "12 4\n", "1 1\n", "1 3\n", "5 12\n", "1 97\n", "1000000000 99999\n",
          "123456789 62500\n", "1 99989\n", "3 15625\n", "999999999 99991\n", "7 99904\n", "1 96\n"]
for _ in range(2):
    tests.append(f"{random.randint(0, 10**9)} {random.randint(50000, 100000)}\n")
print(json.dumps(tests))
