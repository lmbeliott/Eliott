import json, random
random.seed(2026)

tests = ["10 3 5\n", "20 4 6\n"]
tests.append("1 1 1\n")
tests.append("1000000000 1 1\n")
tests.append("1000000000 1 1000000000\n")
tests.append("1000000000 2 3\n")
tests.append("1000000000 999999937 999999929\n")
tests.append("5 7 9\n")
tests.append("1000000000 12 18\n")
tests.append("999999999 7 7\n")
tests.append("1000000000 31623 31627\n")
for _ in range(4):
    tests.append(f"{random.randint(10**8, 10**9)} {random.randint(1, 10**5)} {random.randint(1, 10**5)}\n")
print(json.dumps(tests))
