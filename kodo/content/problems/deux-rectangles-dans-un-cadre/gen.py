import json, random
random.seed(2026)

def test(w, h, a, b, c, d):
    return f"{w} {h}\n{a} {b}\n{c} {d}\n"

def possible(w, h, a, b, c, d):
    for (w1, h1) in [(a, b), (b, a)]:
        for (w2, h2) in [(c, d), (d, c)]:
            if w1 + w2 <= w and h1 <= h and h2 <= h:
                return True
            if h1 + h2 <= h and w1 <= w and w2 <= w:
                return True
    return False

tests = [test(10, 6, 4, 6, 6, 5), test(7, 4, 4, 3, 4, 3), test(5, 5, 3, 3, 3, 3)]
tests += [
    test(1, 1, 1, 1, 1, 1),           # trop petit
    test(2, 1, 1, 1, 1, 1),           # pile la bonne taille
    test(1, 2, 1, 1, 1, 1),
    test(10, 10, 11, 1, 1, 1),        # un rectangle dépasse dans tous les sens
    test(10, 3, 3, 7, 3, 3),          # seul le premier doit tourner
    test(3, 10, 3, 7, 3, 3),          # l'un au-dessus de l'autre, sans tourner
    test(10, 3, 3, 3, 7, 3),          # seul le second doit tourner
    test(6, 9, 9, 2, 4, 6),           # le premier tourne, puis l'un au-dessus de l'autre
    test(1000, 1000, 1000, 500, 500, 1000),
    test(1000, 1000, 1000, 501, 500, 1000),
    test(1000, 1, 500, 1, 1, 500),
    test(8, 8, 5, 5, 5, 5),           # aire suffisante, mais impossible
]
# Cas aléatoires, autant de OUI que de NON.
voulu = True
while len(tests) < 26:
    w, h = random.randint(1, 1000), random.randint(1, 1000)
    a, b, c, d = (random.randint(1, 1000) for _ in range(4))
    if possible(w, h, a, b, c, d) == voulu:
        tests.append(test(w, h, a, b, c, d))
        voulu = not voulu
print(json.dumps(tests))
