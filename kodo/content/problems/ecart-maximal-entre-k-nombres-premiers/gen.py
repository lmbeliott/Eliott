import json, random
random.seed(4303)
tests = ["1 30 4\n", "24 28 2\n", "2 3 2\n", "2 2 2\n", "1 1 2\n", "89 97 2\n", "1 100 25\n", "1 100 26\n"]
tests += [f"{random.randint(1, 500)} {random.randint(500, 1000)} {random.randint(2, 30)}\n" for _ in range(3)]
tests += ["1 1000000 2\n", "1 1000000 78498\n", "1 1000000 39000\n", "500000 1000000 1000\n",
          "999000 1000000 10\n", "1 1000000 300\n", "123456 987654 25000\n"]
print(json.dumps(tests))
