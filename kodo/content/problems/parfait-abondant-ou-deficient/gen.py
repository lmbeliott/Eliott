import json, random
random.seed(2026)

tests = ["3\n6\n12\n10\n", "4\n1\n16\n28\n945\n"]
tests.append("5\n496\n8128\n33550336\n2\n36\n")
tests.append("1\n1000000000\n")
tests.append("1\n999999937\n")
tests.append("6\n4\n9\n25\n49\n999950884\n998001\n")
tests.append("20\n" + "".join(f"{999999999 - i}\n" for i in range(20)))
tests.append("20\n" + "".join(f"{x}\n" for x in [18, 20, 24, 30, 40, 42, 48, 54, 56, 60, 70, 88, 104, 945, 1575, 2205, 3465, 4095, 5355, 735134400]))
for _ in range(3):
    tests.append("20\n" + "".join(f"{random.randint(1, 10**9)}\n" for _ in range(20)))
tests.append("20\n" + "".join(f"{random.randint(1, 1000)}\n" for _ in range(20)))
print(json.dumps(tests))
