import json, random
random.seed(2026)

VAL = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
SYM = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]


def romain(n):
    s = ""
    for v, c in zip(VAL, SYM):
        while n >= v:
            s += c
            n -= v
    return s


def test(lignes):
    return f"{len(lignes)}\n" + "".join(f"{l}\n" for l in lignes)


tests = [test(["1994", "MMXXVI", "4"]), test(["XLIX", "3999", "IX"])]
tests.append(test(["1"]))
tests.append(test(["I"]))
tests.append(test(["3999", "MMMCMXCIX", "3888", "MMMDCCCLXXXVIII"]))
tests.append(test([str(v) for v in VAL] + SYM))
tests.append(test([str(n) for n in range(1, 101)]))
tests.append(test([romain(n) for n in range(1, 101)]))
lignes = []
for n in range(1, 4000, 4):
    lignes.append(str(n) if random.random() < 0.5 else romain(n))
random.shuffle(lignes)
tests.append(test(lignes))
tests.append(test([romain(random.randint(1, 3999)) for _ in range(1000)]))
tests.append(test([str(random.randint(1, 3999)) for _ in range(1000)]))
print(json.dumps(tests))
