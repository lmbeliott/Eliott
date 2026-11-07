import json, random
random.seed(2026)


def nombre(l):
    return random.choice("123456789") + "".join(random.choice("0123456789") for _ in range(l - 1))


def test(a, b):
    return f"{a}\n{b}\n"


tests = [test("9", "10"), test("-500", "-20")]
tests += [test("0", "0"), test("0", "-1"), test("-1", "0"), test("-1", "-2"), test("7", "7"),
          test("123", "124"), test("-123", "-124")]
x = nombre(10000)
tests.append(test(x, x))
tests.append(test("-" + x, "-" + x))
y = x[:5000] + str((int(x[5000]) + 1) % 10) + x[5001:]
tests.append(test(x, y))
tests.append(test("-" + x, "-" + y))
tests.append(test(nombre(9999), nombre(10000)))
tests.append(test("-" + nombre(10000), "-" + nombre(9999)))
tests.append(test("-" + nombre(10000), nombre(3)))
print(json.dumps(tests))
