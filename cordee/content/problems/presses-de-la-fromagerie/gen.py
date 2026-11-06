import json, random
random.seed(2026)

def test(m, durees):
    return f"{len(durees)} {m}\n" + " ".join(map(str, durees)) + "\n"

tests = [
    test(8, [2, 3, 5]),
    test(5, [7]),
    test(1, [9, 4, 6]),                       # une seule tomme : la presse la plus rapide
    test(10**9, [10**9]),                     # réponse 10^18
    test(10**9, [10**9, 10**9]),
    test(7, [3, 3, 3]),
    test(1000, [1] * 10),
    test(100, [random.randint(1, 50) for _ in range(20)]),
]
# beaucoup de presses très rapides : la somme déborde si on ne s'arrête pas à temps
tests.append(test(10**9, [1] * 9999 + [10**9]))
tests.append(test(10**9, [random.randint(1, 100) for _ in range(10000)]))
# tailles maximales
tests.append(test(10**9, [random.randint(1, 10**9) for _ in range(10000)]))
tests.append(test(987654321, [random.randint(10**8, 10**9) for _ in range(10000)]))
tests.append(test(10**9, [random.randint(10**6, 10**9) for _ in range(9999)] + [10**9]))
print(json.dumps(tests))
