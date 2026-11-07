import json, random
random.seed(2026)

def test(v):
    return f"{len(v)}\n" + "".join(f"{x}\n" for x in v)

tests = [test([3, 1, 4, 5, 9, 2, 6]), test([5, 5, 5, 2])]
tests += [
    test([7]),                                 # une seule mesure
    test([0, 1000000]),
    test([4, 4]),                              # égales : pas de montée
    test([9, 8, 7, 6, 5]),                     # toujours en baisse
    test([1, 2, 3, 3, 4, 5, 6]),               # une égalité coupe la montée
    test([5, 1, 2, 3, 4, 5, 6]),               # la plus longue finit à la fin
    test(list(range(0, 10000))),               # une seule grande montée
    test([random.randint(0, 3) for _ in range(10000)]),
    test([random.randint(0, 1000000) for _ in range(10000)]),
]
# De longues montées, coupées de temps en temps.
v = []
x = 500000
for _ in range(10000):
    if random.random() < 0.002:
        x = random.randint(0, 600000)
    else:
        x += random.randint(0, 40)
    v.append(min(x, 1000000))
tests.append(test(v))
for _ in range(3):
    n = random.randint(5, 30)
    tests.append(test([random.randint(0, 9) for _ in range(n)]))
print(json.dumps(tests))
