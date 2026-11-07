import json, random
random.seed(2051)

def test(paires):
    return f"{len(paires)}\n" + "".join(f"{a} {b}\n" for a, b in paires)

M = 10 ** 18
tests = []
tests.append(test([(4, 5), (12, 13), (2, 7), (1, 1), (9, 9), (1, 10)]))
tests.append(test([(8, 3), (16, 17), (6, 14)]))
tests.append(test([(1, M), (M, M), (M, M - 1), (2 ** 59, 2 ** 59 + 1), (2 ** 59, M), (576460752303423487, 576460752303423488)]))
tests.append(test([(random.randint(1, M), random.randint(1, M)) for _ in range(2000)]))
tests.append(test([(random.randint(1, 1000), random.randint(1, 1000)) for _ in range(2000)]))
# des paires proches dans l'arbre : un nœud et un de ses descendants
p = []
for _ in range(2000):
    a = random.randint(1, 10 ** 9)
    b = a
    for _ in range(random.randint(0, 29)):
        b = 2 * b + random.randint(0, 1)
    p.append((b, a) if random.random() < 0.5 else (a, b))
tests.append(test(p))
# des nœuds de même profondeur
p = []
for _ in range(2000):
    k = random.randint(1, 58)
    p.append((random.randint(2 ** k, 2 ** (k + 1) - 1), random.randint(2 ** k, 2 ** (k + 1) - 1)))
tests.append(test(p))
print(json.dumps(tests))
