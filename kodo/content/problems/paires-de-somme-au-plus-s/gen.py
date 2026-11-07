import json, random
random.seed(2026)

tests = ["5 10\n3 7 2 11\n", "6 4\n1 1 1 5\n"]
tests.append("2 0\n0 0 0 1\n")
tests.append("2 5\n3 1 0 7\n")
tests.append("200000 2000000000\n999999999 999999998 999999997 1000000000\n")
tests.append("200000 0\n123 456 789 1000000000\n")
tests.append("200000 1000000000\n12345 1103515245 12345 1000000000\n".replace("1103515245", "110351524"))
tests.append("200000 50\n7 31 11 100\n")
tests.append("200000 1\n0 0 0 1\n")
tests.append("1000 700\n5 17 3 1000\n")
for _ in range(3):
    m = random.choice([10, 1000, 10**6, 10**9])
    n = 200000
    s = random.randint(0, 2 * m)
    tests.append(f"{n} {s}\n{random.randint(0, m - 1)} {random.randint(0, m - 1)} {random.randint(0, m - 1)} {m}\n")
print(json.dumps(tests))
