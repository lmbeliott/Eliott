import json, random
random.seed(2026)

E = 10**18
tests = ["1 20 3\n", "-7 7 2\n"]
tests += ["0 0 5\n", "1 1 2\n", "-3 -3 3\n", "-5 -1 5\n", f"{-E} {E} 1\n", f"{-E} {E} {E}\n",
          f"1 {E - 1} {E}\n", "-10 -4 3\n", f"{-E} -1 7\n", f"{E - 10} {E} 999999999999999999\n"]
for _ in range(3):
    a = random.randint(-E, E)
    b = random.randint(a, E)
    tests.append(f"{a} {b} {random.randint(1, 10**9)}\n")
print(json.dumps(tests))
