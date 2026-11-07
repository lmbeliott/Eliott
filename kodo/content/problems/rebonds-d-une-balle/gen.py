import json, random
random.seed(2026)

tests = ["100 50\n", "7 10\n"]
tests += ["1 99\n", "1000000000 0\n", "1000000000 99\n", "100 1\n", "101 1\n",
          "1 0\n", "999999999 98\n", "64 50\n"]
for _ in range(4):
    tests.append(f"{random.randint(1, 10**9)} {random.randint(0, 99)}\n")
print(json.dumps(tests))
