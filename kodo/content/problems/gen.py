import json, random
random.seed(2026)

tests = ["3\n3 1 2 4\n", "6\n5 3 1 10\n"]
tests.append("1\n7 0 0 10\n")
tests.append("100000\n999999 1 0 1000000\n")
tests.append("100000\n0 1 1 1000000\n")
tests.append("100000\n999999 1 999999 1000000\n")
tests.append("100000\n12345 987 654321 1000000\n")
tests.append("100000\n3 7 1 10\n")
tests.append("1000\n17 31 5 1000\n")
tests.append("100000\n0 0 0 1\n")
tests.append(f"100000\n{random.randint(0, 999998)} {random.randint(0, 999998)} {random.randint(0, 999998)} 999999\n")
print(json.dumps(tests))
