import json, random
random.seed(2026)

tests = ["20 6\n", "5 12\n"]
tests += ["24 8\n", "0 5\n", "0 1\n", "10000 1\n", "10000 100\n", "99 100\n", "100 100\n", "9999 7\n"]
for _ in range(4):
    tests.append(f"{random.randint(0, 10000)} {random.randint(1, 100)}\n")
print(json.dumps(tests))
