import json, random
random.seed(2026)

tests = ["3\n10\n4\n28\n", "2\n100\n12\n"]
tests.append("1\n4\n")
tests.append("1\n10000\n")
tests.append("1\n6\n")
tests.append("5\n8\n14\n22\n38\n98\n")
tests.append("10\n" + "".join(f"{10000 - 2 * i}\n" for i in range(10)))
tests.append("10\n9240\n9660\n9450\n8190\n9990\n6930\n7980\n8580\n9870\n10000\n")
for _ in range(3):
    tests.append("10\n" + "".join(f"{2 * random.randint(2, 5000)}\n" for _ in range(10)))
tests.append("10\n" + "".join(f"{2 * random.randint(2, 50)}\n" for _ in range(10)))
print(json.dumps(tests))
