import json, random
random.seed(2026)


def test(vals):
    return f"{len(vals)}\n" + "".join(f"{v}\n" for v in vals)


E = 10**18
tests = [test([30, 49, 2]), test([0, 1, 1000000000000000000])]
tests.append(test([E - 1]))
tests.append(test([3, 4, 5, 8, 9, 10, 15, 16, 17]))
# carrés parfaits, et leurs voisins, pour de grandes racines
grands = []
for _ in range(300):
    k = random.randint(10**8, 10**9)
    grands += [k * k - 1, k * k, k * k + 2 * k]
tests.append(test(grands))
tests.append(test([(10**9 - i) ** 2 - 1 for i in range(1000)]))
tests.append(test([(94906265 + i) ** 2 + d for i in range(250) for d in (-1, 0, 1, 2)]))   # autour de 2^53
tests.append(test([random.randint(0, E) for _ in range(1000)]))
tests.append(test([random.randint(0, 10**6) for _ in range(1000)]))
tests.append(test([random.randint(0, 10**12) for _ in range(500)]))
tests.append(test([E] * 3 + [E - 2, 999999998000000001, 999999998000000000]))
print(json.dumps(tests))
