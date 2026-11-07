import json, random
random.seed(2026)

tests = ["3 4 5\n", "2 3 5\n", "6 6 6\n", "5 8 5\n"]
tests += ["1 1 1\n", "1 1 2\n", "1 1 1000000\n", "1000000 1000000 1000000\n", "1000000 999999 1\n",
          "1000000 999999 2\n", "10 3 3\n", "7 10 7\n", "4 9 9\n", "2 10 5\n"]
for _ in range(3):
    tests.append(" ".join(str(random.randint(1, 100)) for _ in range(3)) + "\n")
print(json.dumps(tests))
