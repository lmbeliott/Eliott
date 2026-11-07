import json, random
random.seed(2026)

def test(n, k):
    return f"{n} {k}\n"

G = 10**6
tests = [
    test(6, 2),          # C(6, 2) = 15 = 3 × 5 : 4 diviseurs
    test(10, 5),         # C(10, 5) = 252 = 2² × 3² × 7 : 18 diviseurs
    test(0, 0),          # C(0, 0) = 1
    test(1, 1),
    test(7, 0),
    test(30, 15),
    test(G, 0),
    test(G, 1),          # C(N, 1) = N = 2⁶ × 5⁶ : 49 diviseurs
    test(999983, 1),     # un nombre premier
    test(999983, 456789),
    test(2**19, 2**18),
    test(1000, 500),
]
# tailles maximales
tests.append(test(G, G // 2))
tests.append(test(G, G - 1))
tests.append(test(G, random.randint(1, G)))
n = random.randint(G - 1000, G)
tests.append(test(n, random.randint(0, n)))
print(json.dumps(tests))
