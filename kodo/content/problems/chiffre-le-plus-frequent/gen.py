import json, random
random.seed(2026)

tests = ["3141592653\n", "1000000000000000000\n"]
tests += ["0\n", "7\n", "9876543210\n", "999999999999999999\n", "122333444455555\n",
          "90909\n", "5\n", "11\n", "101\n"]
for _ in range(4):
    tests.append(f"{random.randint(1, 10**random.randint(2, 18))}\n")
print(json.dumps(tests))
