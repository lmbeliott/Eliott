import json, random
random.seed(4208)


def texte(points):
    return f"{len(points)}\n" + "".join(f"{x} {y}\n" for x, y in points)


def alea(n, cmax):
    return [(random.randint(0, cmax), random.randint(0, cmax)) for _ in range(n)]


tests = [texte([(1, 5), (3, 9), (7, 6), (9, 1), (4, 4)]), texte([(2, 1), (2, 100), (50, 100)])]
tests.append(texte([(7, 7)]))
tests.append(texte([(0, 0), (10 ** 9, 10 ** 9)]))
tests.append(texte([(3, 3)] * 4 + [(4, 8)]))
for n, c in [(6, 10), (10, 30), (40, 1000), (300, 10 ** 9)]:
    tests.append(texte(alea(n, c)))
# points sur une diagonale : chaque liaison coûte autant en x qu'en y
tests.append(texte([(i * 7, i * 7) for i in range(2000)]))
# grands
tests.append(texte(alea(8000, 10 ** 9)))
tests.append(texte(alea(10000, 3000)))
pts = [(random.randint(0, 10 ** 9), i * 100000) for i in range(3000)] + [(i * 100000, random.randint(0, 10 ** 9)) for i in range(2000)]
random.shuffle(pts)
tests.append(texte(pts))
print(json.dumps(tests))
