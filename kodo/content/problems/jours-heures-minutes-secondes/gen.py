import json, random
random.seed(2026)

tests = ["3725\n", "90061\n"]
tests += ["0\n", "59\n", "60\n", "3599\n", "86399\n", "86400\n", "1000000000\n"]
for _ in range(4):
    tests.append(f"{random.randint(0, 10**9)}\n")
tests.append(f"{random.randint(0, 200000)}\n")
print(json.dumps(tests))
