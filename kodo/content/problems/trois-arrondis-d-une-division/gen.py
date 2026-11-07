import json, random
random.seed(2026)

E = 10**18
tests = ["250 60\n", "7 2\n"]
tests += ["0 1\n", "0 1000000000000000000\n", "12 4\n", "5 3\n", "1 3\n",
          f"{E - 1} 1\n", f"{E} 3\n", f"{E - 1} {E}\n", f"{E} {E}\n",
          f"{E // 2} {E}\n", f"{E - 1} 2\n", "999999999999999997 999999999999999998\n"]
for _ in range(3):
    tests.append(f"{random.randint(0, E)} {random.randint(1, 10**9)}\n")
print(json.dumps(tests))
