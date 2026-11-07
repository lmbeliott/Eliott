import json, random
random.seed(2026)

tests = ["2026\n", "0\n"]
for n in [7, 9, 10, 99, 100, 999999999, 1000000000, 10**18 - 1, 10**18]:
    tests.append(f"{n}\n")
for _ in range(4):
    tests.append(f"{random.randint(1, 10**random.randint(2, 18))}\n")
print(json.dumps(tests))
