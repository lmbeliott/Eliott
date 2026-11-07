import json, random
random.seed(2026)

tests = ["6\n", "1\n"]
tests += ["2\n", "3\n", "27\n", "704511\n", "837799\n", "1000000\n", "999999\n", "524288\n"]
for _ in range(4):
    tests.append(f"{random.randint(1, 10**6)}\n")
print(json.dumps(tests))
