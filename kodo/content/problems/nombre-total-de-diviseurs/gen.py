import json, random
random.seed(2026)

def test(l, r):
    return f"{l} {r}\n"

T = 10**12
tests = [
    test(1, 6),
    test(10, 12),
    test(1, 1),
    test(999999999989, 999999999989),    # un nombre premier : 2 diviseurs
    test(963761198400, 963761198400),    # un nombre qui a énormément de diviseurs
    test(T, T),
    test(1, 1000),
    test(123456, 7654321),
    test(10**6 * 10**6 - 1, 10**6 * 10**6),   # autour d'un carré parfait
    test(999999 * 999999, 999999 * 999999 + 1),
]
# tailles maximales
tests.append(test(1, T))
tests.append(test(1, T - 1))
x = random.randint(T // 2, T)
tests.append(test(random.randint(1, 1000), x))
tests.append(test(x // 3, x))
print(json.dumps(tests))
