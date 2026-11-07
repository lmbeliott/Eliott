import json, random
random.seed(4107)


def texte(x, pieces):
    return f"{len(pieces)} {x}\n" + " ".join(map(str, pieces)) + "\n"


tests = [texte(30, [6, 10, 15]), texte(20, [4, 6])]
tests.append(texte(1, [1]))
tests.append(texte(10 ** 18, [1, 10 ** 9]))
tests.append(texte(5, [7, 9]))
tests.append(texte(10 ** 18, [3]))
tests.append(texte(100, [10, 10, 25, 25]))
tests.append(texte(1000, [12, 18, 30, 45]))
for _ in range(3):
    tests.append(texte(random.randint(1, 3000), [random.randint(2, 40) for _ in range(random.randint(1, 5))]))
tests.append(texte(10 ** 18 - 1, [2, 999999937, 1000000000]))
# grands : la plus petite pièce est proche de 50 000
for x, p in [(10 ** 18, [49999, 999999937, 999999929, 99991, 1000000000]),
             (10 ** 18, [49998, 49999, 50000, 10 ** 9, 777777777]),
             (123456789012345678, [50000, 10 ** 9, 10 ** 9 - 2, 300000006, 500000004]),
             (10 ** 15, [49993, 50021, 49999 * 20000, 3 * 10 ** 8 + 7, 9 * 10 ** 8 + 11]),
             (10 ** 18, [49957] + [random.randint(10 ** 8, 10 ** 9) for _ in range(4)])]:
    tests.append(texte(x, p))
print(json.dumps(tests))
