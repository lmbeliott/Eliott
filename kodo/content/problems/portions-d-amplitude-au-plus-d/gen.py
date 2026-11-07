import json, random
random.seed(2026)

tests = ["3 1\n3 4 2 5\n", "8 2\n1 3 2 7\n"]
tests.append("1 0\n5 1 1 10\n")
tests.append("100000 0\n7 1 0 10\n")
tests.append("100000 1000000\n123 456 789 1000000\n")
tests.append("100000 0\n0 1 1 1000000\n")
tests.append("100000 5\n0 1 1 1000000\n")
tests.append("100000 3\n12 34 56 100\n")
tests.append("100000 100000\n999 997 13 1000000\n")
tests.append("100000 1000\n2 1 999999 1000000\n")
tests.append("500 50\n17 31 5 101\n")
for _ in range(3):
    m = random.choice([10, 1000, 10**6])
    tests.append(f"100000 {random.randint(0, m // 3)}\n{random.randint(0, m - 1)} {random.randint(0, m - 1)} {random.randint(0, m - 1)} {m}\n")
print(json.dumps(tests))
