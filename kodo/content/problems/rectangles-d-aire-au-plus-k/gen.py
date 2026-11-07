import json, random
random.seed(2026)

tests = ["2 3 2\n", "3 3 9\n", "4 1 2\n"]
tests += ["1 1 1\n", "500 500 250000\n", "500 500 1\n", "500 500 1000\n", "1 500 7\n",
          "500 1 500\n", "317 499 12345\n"]
for _ in range(4):
    tests.append(f"{random.randint(1, 500)} {random.randint(1, 500)} {random.randint(1, 250000)}\n")
print(json.dumps(tests))
