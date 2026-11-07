import json, random
random.seed(2026)

MAX = 10 ** 18


def fmt(m, requetes):
    return f"{m} {len(requetes)}\n" + "".join(f"{a} {b}\n" for a, b in requetes) 


def bornes_aleatoires(nb, maxi):
    res = []
    for _ in range(nb):
        # des bornes de toutes les tailles : on tire d'abord le nombre de chiffres
        a = random.randint(1, 10 ** random.randint(1, len(str(maxi)) - 1))
        b = random.randint(1, 10 ** random.randint(1, len(str(maxi)) - 1))
        a, b = min(a, b, maxi), min(max(a, b), maxi)
        res.append((a, b))
    return res


tests = [
    fmt(7, [(1, 100), (100, 200), (1, 1000)]),
    fmt(1, [(1, 9), (10, 99), (5, 5), (11, 11)]),
]
# Petits cas vérifiables à la main, bornes égales, bornes qui sont elles-mêmes en zigzag ou non
tests.append(fmt(3, [(1, 1), (3, 3), (10, 10), (121, 121), (120, 130), (1, 10 ** 4)]))
tests.append(fmt(11, [(1, 10 ** 5), (909, 909), (90909, 90909), (98765, 98766)]))
tests.append(fmt(500, [(1, 10 ** 6), (123456, 7654321)]))
tests.append(fmt(13, bornes_aleatoires(40, 10 ** 6)))
# Bornes extrêmes : 10^18 a 19 chiffres
tests.append(fmt(1, [(1, MAX), (MAX, MAX), (MAX - 10 ** 9, MAX), (909090909090909090, 909090909090909091)]))
tests.append(fmt(2, [(1, MAX), (10 ** 17, MAX), (1, 10 ** 17 - 1)]))
# Grands tests : beaucoup de requêtes et un grand module
for m in (499, 500, 343):
    tests.append(fmt(m, bornes_aleatoires(2000, MAX)))
tests.append(fmt(97, [(random.randint(1, 10 ** 17), random.randint(10 ** 17, MAX)) for _ in range(1500)]))
print(json.dumps(tests))
