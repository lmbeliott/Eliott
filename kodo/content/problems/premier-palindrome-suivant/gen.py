import json, random
random.seed(2026)

tests = ["120\n", "12\n"]
tests += ["1\n", "2\n", "3\n", "8\n", "11\n", "1000\n", "930\n", "10301\n", "98690\n", "100000\n", "1000000\n", "999999\n"]
for _ in range(3):
    tests.append(f"{random.randint(1, 10**6)}\n")
print(json.dumps(tests))
