import json, random
random.seed(2026)

def test(qs):
    return f"{len(qs)}\n" + "".join(f"{n} {k}\n" for n, k in qs)

tests = [test([(30, 3), (1000000, 2), (1023, 10), (1024, 10), (0, 7), (1, 60)])]
LIM = 10**18
# cas limites : puissances exactes et voisines
qs = [(LIM, 2), (LIM - 1, 2), (999999999 ** 2, 2), (999999999 ** 2 - 1, 2), (LIM, 3), (LIM - 1, 3),
      (2 ** 59, 59), (2 ** 59 - 1, 59), (2 ** 59, 60), (LIM, 60), (3 ** 37, 37), (3 ** 37 - 1, 37)]
tests.append(test(qs))
tests.append(test([(n, k) for n in range(0, 20) for k in (2, 3, 4)]))
# puissances exactes et voisines, pour tous les K
qs = []
for k in range(2, 61):
    r = int(round(LIM ** (1 / k)))
    while r ** k > LIM:
        r -= 1
    for x in (r, r - 1, max(1, r // 2)):
        for d in (-1, 0, 1):
            if 0 <= x ** k + d <= LIM:
                qs.append((x ** k + d, k))
tests.append(test(qs[:1000]))
for _ in range(3):
    qs = []
    for _ in range(1000):
        k = random.choice([2, 2, 3, 3, 4, 5, random.randint(2, 60)])
        if random.random() < 0.5:
            n = random.randint(0, LIM)
        else:
            r = int(LIM ** (1 / k))
            x = random.randint(1, r)
            n = min(LIM, max(0, x ** k + random.choice([-1, 0, 1])))
        qs.append((n, k))
    tests.append(test(qs))
tests.append(test([(LIM - random.randint(0, 10**6), 2) for _ in range(1000)]))
tests.append(test([(random.randint(0, LIM), 60) for _ in range(1000)]))
print(json.dumps(tests))
