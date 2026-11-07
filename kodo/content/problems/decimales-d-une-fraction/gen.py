import json, random
random.seed(2026)

tests = ["22 7 5\n", "1 8 6\n"]
tests += ["0 1 1\n", "1000000000 1 3\n", "1 3 20\n", "2 1000000000 12\n", "999999999 1000000000 15\n",
          "1 7 10000\n", "1 999999937 10000\n", "123456789 98765 40\n", "1 97 200\n"]
for _ in range(3):
    tests.append(f"{random.randint(0, 10**9)} {random.randint(1, 10**9)} {random.randint(1, 10000)}\n")
print(json.dumps(tests))
