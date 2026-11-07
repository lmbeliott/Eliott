import json, random
random.seed(2026)

tests = ["6\n", "100\n"]
tests += ["1\n", "2\n", "3\n", "4\n", "99\n", "1000000\n"]
tests += ["1000000000000\n", "999999999999\n", "999998000001\n", "999997999999\n"]
tests.append(f"{random.randint(10**11, 10**12)}\n")
tests.append(f"{random.randint(10**6, 10**9)}\n")
print(json.dumps(tests))
