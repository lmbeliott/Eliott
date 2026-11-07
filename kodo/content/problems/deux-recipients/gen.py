import json, random
random.seed(2037)

tests = ["3 5 4\n", "6 9 4\n", "1 1 0\n", "1 1 1\n", "7 7 7\n", "4 6 5\n", "2 3 1\n"]
tests.append("50000 49999 25000\n")
tests.append("49997 50000 1\n")
tests.append("50000 30 7\n")
tests.append("30000 45000 15000\n")
tests.append("30000 45000 15001\n")
tests.append("17 50000 50001\n")
tests.append("49991 49993 49992\n")
tests.append("1 50000 49999\n")
for _ in range(3):
    a, b = random.randint(1000, 50000), random.randint(1000, 50000)
    tests.append(f"{a} {b} {random.randint(0, max(a, b))}\n")
print(json.dumps(tests))
