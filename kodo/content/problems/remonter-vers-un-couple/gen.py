import json, random
random.seed(2026)

H = 10**18

def avancer(a, b, n, choix=None):
    for _ in range(n):
        if (choix or random.random)() < 0.5:
            a += b
        else:
            b += a
    return a, b

def chemin(a, b, n):
    """Avance par paquets pour atteindre de grands nombres sans dépasser H."""
    while True:
        k = random.randint(1, 10**6)
        if random.random() < 0.5:
            if a + k * b > H:
                return a, b
            a += k * b
        else:
            if b + k * a > H:
                return a, b
            b += k * a

def test(qs):
    return f"{len(qs)}\n" + "".join(" ".join(map(str, q)) + "\n" for q in qs)

tests = [test([(2, 3, 5, 3), (2, 3, 7, 5), (1, 1, 3, 2)]), test([(1, 1, 1, 1), (2, 2, 4, 2), (3, 5, 2, 5)])]
tests.append(test([(1, 1, H, 1), (1, 1, 1, H), (1, 1, H, H), (2, 1, H, 1)]))
tests.append(test([(1, 1, 2, 2), (5, 5, 5, 5), (4, 6, 4, 6), (3, 7, 10, 7)]))
small = []
for _ in range(300):
    a, b = random.randint(1, 5), random.randint(1, 5)
    c, d = avancer(a, b, random.randint(0, 8))
    if random.random() < 0.3:
        c += random.randint(-2, 2)
        c = max(c, 1)
    small.append((a, b, c, d))
tests.append(test(small))
# grands tests : reculer coup par coup serait bien trop long
big = []
for _ in range(1000):
    a, b = random.randint(1, 1000), random.randint(1, 1000)
    c, d = chemin(a, b, 0)
    if random.random() < 0.3:
        a += random.randint(1, 3)
    big.append((a, b, c, d))
tests.append(test(big))
tests.append(test([(random.randint(1, H), random.randint(1, H), random.randint(1, H), random.randint(1, H)) for _ in range(1000)]))
tests.append(test([(1, b, H - H % b + 1, b) for b in [random.randint(1, 10**6) for _ in range(1000)]]))
print(json.dumps(tests))
