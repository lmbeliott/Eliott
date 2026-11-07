import json, random
random.seed(2026)

tests = ["3\n1 2\n1 3\n1 6\n", "2\n3 4\n5 6\n"]
tests.append("1\n6 4\n")
tests.append("1\n30 30\n")
tests.append("2\n1 3\n2 3\n")
# Dénominateurs premiers entre eux : grand PPCM.
tests.append("20\n" + "".join(f"100 {b}\n" for b in [29, 23, 19, 17, 13, 11, 7, 5, 27, 16, 25, 28, 30, 26, 22, 21, 9, 8, 3, 2]))
tests.append("20\n" + "".join(f"1 {b}\n" for b in range(11, 31)))
tests.append("10\n" + "".join(f"1 {b}\n" for b in range(1, 11)))
tests.append("20\n" + "".join("1 30\n" for _ in range(20)))
for _ in range(4):
    n = random.randint(5, 20)
    tests.append(f"{n}\n" + "".join(f"{random.randint(1, 100)} {random.randint(1, 30)}\n" for _ in range(n)))
print(json.dumps(tests))
