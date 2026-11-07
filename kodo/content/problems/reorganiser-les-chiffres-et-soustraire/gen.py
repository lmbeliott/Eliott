import json, random
random.seed(2026)

tests = ["4 3524\n", "2 53\n"]
tests += ["1 7\n", "4 0\n", "4 6174\n", "4 1000\n", "3 100\n", "6 100000\n",
          "7 1234567\n", "10 1000000000\n", "10 9999999999\n", "10 5555555556\n"]
for d in [5, 8, 9, 10]:
    tests.append(f"{d} {random.randint(0, 10**d - 1)}\n")
print(json.dumps(tests))
