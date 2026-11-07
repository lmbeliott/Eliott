import json, random
random.seed(4309)
tests = ["6\n", "10\n", "1\n", "2\n", "3\n", "100\n", "1000\n", "65536\n", "99991\n"]
tests += [f"{random.randint(10 ** 5, 10 ** 6)}\n", f"{random.randint(10 ** 6, 2 * 10 ** 6)}\n"]
tests += ["2000000\n", "1999993\n", "1500000\n"]
print(json.dumps(tests))
