import json, random
random.seed(2026)

tests = ["3 20\n", "5 5\n"]
tests += ["10 3\n", "1 1\n", "1 1000000000000000000\n", "1000000000 1000000000000000000\n",
          "1 1024\n", "1 1023\n", "1000000000 999999999\n", "7 56\n"]
for _ in range(4):
    a = random.randint(1, 10**9)
    b = random.randint(1, 10**18)
    tests.append(f"{a} {b}\n")
print(json.dumps(tests))
