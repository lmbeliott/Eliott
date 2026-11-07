import json, random
random.seed(2026)

tests = ["3\n9875\n7\n38\n", "4\n0\n10\n999999999999999999\n2026\n"]
tests.append("1\n1000000000000000000\n")
tests.append("1\n0\n")
tests.append("5\n9\n18\n19\n99\n100\n")
for q in [10, 100, 1000, 1000]:
    vals = []
    for _ in range(q):
        k = random.randint(1, 18)
        vals.append(random.randint(0, 10 ** k))
    tests.append(f"{q}\n" + "".join(f"{v}\n" for v in vals))
tests.append("1000\n" + "".join(f"{10**18 - i}\n" for i in range(1000)))
print(json.dumps(tests))
