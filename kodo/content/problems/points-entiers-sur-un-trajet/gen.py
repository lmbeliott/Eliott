import json, random
random.seed(2026)

M = 10**9

def test(points):
    return f"{len(points)}\n" + "".join(f"{x} {y}\n" for x, y in points)

def trajet(n, borne, pas=None):
    points = [(random.randint(-borne, borne), random.randint(-borne, borne))]
    while len(points) < n:
        if pas is None:
            q = (random.randint(-borne, borne), random.randint(-borne, borne))
        else:
            # segments dont les deux écarts ont un grand diviseur commun
            g = random.choice(pas)
            x, y = points[-1]
            q = (x + g * random.randint(-3, 3), y + g * random.randint(-3, 3))
            if abs(q[0]) > borne or abs(q[1]) > borne:
                continue
        if q != points[-1]:
            points.append(q)
    return points

tests = [
    test([(0, 0), (6, 4), (6, -2)]),
    test([(1, 1), (4, 2), (-2, 2), (1, 1)]),
    test([(0, 0), (1, 1)]),
    test([(-M, -M), (M, M)]),                         # 2 × 10⁹ + 1 points
    test([(5, -M), (5, M), (5, -M)]),                 # aller-retour sur un segment vertical
    test([(-M, 7), (M, 7), (M - 1, 8)]),
    test([(0, 0), (999999937, 999999929)]),           # écarts premiers entre eux
    test([(0, 0), (720720000, 360360000), (0, 0)]),
    test(trajet(10, 50)),
    test(trajet(300, M)),
    test(trajet(2000, M, [1, 7, 1000, 123456, 99999989])),
]
# tailles maximales
tests.append(test(trajet(5000, M)))
tests.append(test(trajet(5000, M, [2**20, 3**12, 5**8, 10**6, 999983])))
print(json.dumps(tests))
