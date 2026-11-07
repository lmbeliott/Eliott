import json, random
random.seed(2026)

tests = ["50\n", "3\n"]
tests += ["1\n", "2\n", "25\n", "1000000\n", "999999\n", "5525\n", "828125\n", "994008\n", "65\n"]
for _ in range(3):
    tests.append(f"{random.randint(1, 10**6)}\n")
print(json.dumps(tests))
