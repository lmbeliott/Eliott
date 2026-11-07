import json, random
random.seed(2026)


def poly(deg, coefs=None):
    if coefs is None:
        coefs = [random.randint(-9, 9) for _ in range(deg)]
        dernier = 0
        while dernier == 0:
            dernier = random.randint(-9, 9)
        coefs.append(dernier)
    return f"{deg} " + " ".join(map(str, coefs)) + "\n"


tests = [poly(2, [1, 0, 1]) + poly(1, [1, 1]), poly(1, [0, 3]) + poly(2, [-1, 0, 2])]
tests.append(poly(0, [7]) + poly(3, [1, 2, 3, 4]))
tests.append(poly(3, [1, 2, 3, 4]) + poly(0, [-2]))
tests.append(poly(1, [0, 1]) + poly(4, [5, -4, 3, -2, 1]))
tests.append(poly(4, [5, -4, 3, -2, 1]) + poly(1, [0, 1]))
tests.append(poly(5, [9] * 6) + poly(5, [9] * 6))
tests.append(poly(5, [-9] * 6) + poly(5, [9, -9, 9, -9, 9, -9]))
tests.append(poly(5, [0, 0, 0, 0, 0, 1]) + poly(1, [1, 1]))
tests.append(poly(2, [0, -1, 1]) + poly(2, [0, 0, 1]))
for _ in range(4):
    tests.append(poly(random.randint(0, 5)) + poly(random.randint(0, 5)))
print(json.dumps(tests))
