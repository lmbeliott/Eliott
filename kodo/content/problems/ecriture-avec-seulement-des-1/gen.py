import json, random
random.seed(2026)

def test(ns):
    return f"{len(ns)}\n" + "".join(f"{n}\n" for n in ns)

def repunit(b, m):
    return sum(b ** i for i in range(m))

L = 10**18
tests = [test([31, 13, 3, 4, 7, 21, 1000])]
tests.append(test([L, L - 1, 2 ** 59 - 1, 2 ** 60 - 1 - 2 ** 59, 999999999999999989, 10**18 - 11]))
ns = []
# nombres qui s'écrivent avec des 1 dans une base, pour toutes les longueurs
for m in range(3, 61):
    hi = 2
    while repunit(hi, m) <= L:
        hi += 1 if m > 12 else max(1, hi // 3)
    for _ in range(2):
        b = random.randint(2, max(2, hi - 1))
        while repunit(b, m) > L:
            b -= 1
        if b >= 2:
            ns.append(repunit(b, m))
            ns.append(repunit(b, m) + random.choice([-1, 1]))
tests.append(test(ns[:100]))
tests.append(test([repunit(b, 3) for b in (999999999, 999999998, 10**6, 12345678)] + [repunit(b, 4) for b in (999999, 99999)]))
tests.append(test([random.randint(3, L) for _ in range(100)]))
tests.append(test([random.randint(3, 10**6) for _ in range(100)]))
tests.append(test(list(range(3, 103))))
print(json.dumps(tests))
