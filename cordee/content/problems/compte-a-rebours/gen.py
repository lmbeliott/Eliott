import json, random
random.seed(2026)

tests = ["5\n", "1\n"]
tests += ["2\n", "10\n", "100\n", "99\n"]
for n in random.sample(range(11, 99), 4):
    tests.append(f"{n}\n")
print(json.dumps(tests))
