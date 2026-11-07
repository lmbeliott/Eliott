import json, random
random.seed(2026)

def test(n, c, x, a, b):
    return f"{n} {c}\n{x} {a} {b}\n"

N = 200000
G = 10**9
tests = [test(5, 100, 1, 6, 17), test(6, 10, 1, 3, 1), test(4, 12, 0, 1, 3)]
tests.append(test(2, 100, 5, 1, 90))              # 5 et 95 : par la ligne de départ
tests.append(test(2, 10, 0, 1, 5))                # deux arcs égaux, une seule paire
tests.append(test(2, 1, 0, 0, 0))
tests.append(test(2, G, 0, 1, G - 1))
tests.append(test(3, G, 0, 1, 499999999))         # 0, 499999999, 999999998
tests.append(test(3, 30, 0, 1, 10))               # trois écarts égaux
tests.append(test(3, 2, 0, 1, 1))                 # 0, 1, 0
tests.append(test(N, G, 0, 1, 7))                 # progression : 0, 7, 14...
tests.append(test(N, 7 * N, 0, 1, 7))             # positions régulièrement espacées
tests.append(test(N, G, 3, 1000021, 123457))      # positions toutes différentes
tests.append(test(N, G, 0, 1, 618033989))         # pas irrationnel : au plus trois écarts différents
tests.append(test(N, 1000003, 5, 1, 387000))
tests.append(test(N, 1000, 5, 0, 5))              # tous au même endroit : N(N - 1)/2 paires
tests.append(test(N, G, 17, 0, 42))               # tous au même endroit sauf le premier
tests.append(test(N, 1000, 1, 31, 7))
tests.append(test(1000, 10**6, 12345, 4321, 777))
for _ in range(3):
    c = random.choice([G, 999999937, 10**7])
    tests.append(test(N, c, random.randint(0, c - 1), random.randint(1, c - 1), random.randint(0, c - 1)))
print(json.dumps(tests))
