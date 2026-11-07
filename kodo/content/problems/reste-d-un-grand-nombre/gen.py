import json, random
random.seed(2026)


def nombre(l):
    return random.choice("123456789") + "".join(random.choice("0123456789") for _ in range(l - 1))


tests = ["2026\n7\n", "123456789123456789123456789\n1000\n"]
tests.append("0\n1\n")
tests.append("5\n1000000000\n")
tests.append("9\n1\n")
tests.append("1" + "0" * 99999 + "\n999999999\n")
tests.append("9" * 100000 + "\n1000000000\n")
tests.append(nombre(30000) + "\n3\n")
tests.append(nombre(1000) + "\n11\n")
tests.append(nombre(20000) + "\n" + str(random.randint(1, 10**9)) + "\n")
tests.append(nombre(50) + "\n999999937\n")
tests.append("1" * 4400 + "\n12345\n")
print(json.dumps(tests))
