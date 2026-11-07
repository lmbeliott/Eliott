import json, random
random.seed(2026)

tests = ["1203\n", "12321\n"]
tests += ["0\n", "7\n", "4500\n", "10\n", "11\n", "1000000000000000000\n",
          "123456789987654321\n", "999999999999999999\n", "100000000000000001\n"]
for _ in range(4):
    tests.append(f"{random.randint(1, 10**random.randint(3, 18))}\n")
print(json.dumps(tests))
