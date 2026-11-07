import json, random
random.seed(2026)

def test(points):
    return f"{len(points)}\n" + "".join(f"{x} {y}\n" for x, y in points)

def aleatoires(n, taille):
    pts = set()
    while len(pts) < n:
        pts.add((random.randint(0, taille), random.randint(0, taille)))
    pts = sorted(pts)
    random.shuffle(pts)
    return pts

def reseau(k, x0=0, y0=0):
    pts = [(x0 + x, y0 + y) for x in range(k) for y in range(k)]
    random.shuffle(pts)
    return pts

tests = [test([(0, 0), (2, 0), (0, 2), (2, 2), (1, -1), (3, 1), (1, 1), (5, 5)]),
         test(reseau(3))]
tests.append(test([(7, 7)]))                                   # un seul point
tests.append(test([(0, 0), (1, 0), (0, 1)]))                   # trois coins seulement
tests.append(test([(0, 1), (1, 0), (2, 1), (1, 2)]))           # un carré penché
tests.append(test([(0, 0), (3, 1), (2, 4), (-1, 3)]))          # penché, côté non entier
tests.append(test([(-1000, -1000), (1000, -1000), (-1000, 1000), (1000, 1000), (0, 0)]))
tests.append(test(reseau(10, -5, 3)))
tests.append(test(reseau(22)))                                 # 484 points
tests.append(test(aleatoires(60, 10)))
tests.append(test(aleatoires(300, 30)))
tests.append(test(aleatoires(500, 40)))
tests.append(test(aleatoires(500, 1000)))
print(json.dumps(tests))
