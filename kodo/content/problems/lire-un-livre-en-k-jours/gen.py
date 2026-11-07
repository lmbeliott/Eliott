import json, random
random.seed(2026)

def test(k, chapitres):
    return f"{len(chapitres)} {k}\n" + " ".join(map(str, chapitres)) + "\n"

def aleatoire(n, lo=1, hi=10000):
    return [random.randint(lo, hi) for _ in range(n)]

tests = [
    test(3, [12, 7, 9, 15, 4, 8]),
    test(4, [5, 9, 3, 9]),
    test(1, [42]),
    test(1, [10, 20, 30]),                  # un seul jour : tout le livre
    test(2, [1, 1, 1, 1, 50]),              # le plus long chapitre impose la réponse
    test(3, [7] * 9),
    test(2, [10000, 1, 1, 1, 1, 1, 1, 10000]),
    test(4, aleatoire(20)),
    test(300, aleatoire(300)),              # K = N : un chapitre par jour
]
tests.append(test(17, aleatoire(3000)))
tests.append(test(2, aleatoire(5000, 9000, 10000)))
tests.append(test(1500, aleatoire(5000)))
tests.append(test(37, aleatoire(15000)))
# tailles maximales : la réponse est loin de max(L), et assez loin de la moyenne S / K
tests.append(test(2, aleatoire(25000)))
tests.append(test(16667, aleatoire(25000, 9000, 10000)))   # environ 1,5 chapitre par jour
print(json.dumps(tests))
