import json, random
random.seed(4105)
tests = ["7 10\n", "7 2\n", "1 10\n", "1000 10\n", "81 3\n", "99999 10\n", "12 7\n", "97 2\n", "39 5\n"]
tests += [f"{random.randint(2, 200)} {random.randint(2, 10)}\n" for _ in range(4)]
# grands K, dont des nombres premiers
for k, b in [(99991, 10), (99989, 2), (99971, 7), (98304, 6), (100000, 3), (99997, 9)]:
    tests.append(f"{k} {b}\n")
print(json.dumps(tests))
