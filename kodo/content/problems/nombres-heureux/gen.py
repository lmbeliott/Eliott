import json, random
random.seed(2026)

tests = ["3\n19\n4\n1\n", "4\n7\n2\n100\n13\n"]
tests.append("1\n1\n")
tests.append("1\n1000000000000000000\n")
tests.append("1\n999999999999999999\n")
tests.append("1\n89\n")
tests.append("1000\n" + "".join(f"{i}\n" for i in range(1, 1001)))
tests.append("1000\n" + "".join(f"{10**18 - i}\n" for i in range(1000)))
tests.append("10\n3789\n78999\n356\n3088\n15999\n5\n6\n7\n44\n49\n")
for _ in range(3):
    vals = [random.randint(1, 10 ** random.randint(1, 18)) for _ in range(1000)]
    tests.append("1000\n" + "".join(f"{v}\n" for v in vals))
print(json.dumps(tests))
