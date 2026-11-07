import json, random
random.seed(2026)

tests = ["13 2\n", "347 10\n", "0 7\n"]
tests += ["1 2\n", "4 2\n", "255 16\n", "256 16\n", "1000000000000 2\n",
          "1000000000000 16\n", "999999999999 3\n", "15 16\n", "16 2\n"]
for _ in range(4):
    tests.append(f"{random.randint(1, 10**12)} {random.randint(2, 16)}\n")
print(json.dumps(tests))
