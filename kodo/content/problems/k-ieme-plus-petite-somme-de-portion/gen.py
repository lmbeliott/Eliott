import json, random
random.seed(2026)

def test(k, valeurs):
    return f"{len(valeurs)} {k}\n" + " ".join(map(str, valeurs)) + "\n"

def aleatoire(n, lo=1, hi=10000):
    return [random.randint(lo, hi) for _ in range(n)]

def portions(n):
    return n * (n + 1) // 2

tests = [
    test(4, [3, 1, 4, 2]),
    test(9, [5, 2, 7, 2, 5]),
    test(1, [8]),
    test(1, [6, 1, 9]),                       # K = 1 : la plus petite valeur
    test(6, [6, 1, 9]),                       # K maximal : la somme de tout
    test(5, [2, 2, 2, 2]),                    # beaucoup de sommes égales
    test(30, [1] * 10 + [10000]),
    test(100, aleatoire(25)),
    test(portions(500) // 2, aleatoire(500)),
    test(12345, aleatoire(3000, 1, 50)),
    test(portions(5000) - 5, aleatoire(5000)),
]
# tailles maximales : plus de 4 × 10^8 portions, impossible de toutes les écrire
n = 30000
tests.append(test(portions(n) // 2, aleatoire(n)))
tests.append(test(987654321, aleatoire(n, 9000, 10000)))
tests.append(test(portions(n) - 123456, aleatoire(n, 1, 3)))
print(json.dumps(tests))
