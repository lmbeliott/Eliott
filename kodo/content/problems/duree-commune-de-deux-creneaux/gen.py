import json, random
random.seed(2026)

def test(a, b, c, d):
    return f"{a} {b}\n{c} {d}\n"

tests = [test(60, 180, 120, 300), test(0, 30, 30, 90), test(100, 500, 200, 250)]
tests += [
    test(0, 1440, 0, 1440),        # deux fois toute la journée
    test(0, 1, 0, 1),              # une seule minute, la même
    test(0, 1, 1, 2),              # bout à bout
    test(1439, 1440, 0, 1439),     # bout à bout, dans l'autre ordre
    test(500, 600, 100, 200),      # séparés, le second avant le premier
    test(100, 200, 500, 600),      # séparés
    test(200, 250, 100, 500),      # le premier à l'intérieur du second
    test(300, 900, 300, 600),      # même début
    test(300, 900, 600, 900),      # même fin
    test(400, 800, 0, 1440),
    test(700, 1000, 100, 701),     # une seule minute en commun
]
for _ in range(8):
    a = random.randint(0, 1439)
    b = random.randint(a + 1, 1440)
    c = random.randint(0, 1439)
    d = random.randint(c + 1, 1440)
    tests.append(test(a, b, c, d))
print(json.dumps(tests))
