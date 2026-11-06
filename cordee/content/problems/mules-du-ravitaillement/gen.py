import json, random
random.seed(2026)

def test(k, sacs):
    return f"{len(sacs)} {k}\n" + " ".join(map(str, sacs)) + "\n"

def aleatoire(n, lo, hi):
    return [random.randint(lo, hi) for _ in range(n)]

tests = [
    test(2, [8, 7, 6, 5, 4]),
    test(2, [3, 3, 2, 2, 2]),
    test(3, [500]),                          # un seul sac
    test(1, [12, 30, 7, 1]),                 # une seule mule : elle porte tout
    test(5, [40, 10, 25]),                   # plus de mules que de sacs
    test(4, [250] * 12),                     # tout identique
    test(3, [9, 9, 9, 9, 2, 2]),
    test(2, aleatoire(8, 1, 100)),
    # tailles maximales : 12 sacs, jusqu'à 5 mules
    test(5, [236, 985, 1, 1, 13, 25, 993, 1000, 441, 43, 142, 1]),
    test(5, [917, 911, 930, 960, 910, 901, 971, 905, 914, 957, 985, 917]),
    test(4, [974, 392, 430, 460, 448, 381, 390, 387, 386, 507, 482, 397]),
    test(5, [437, 368, 586, 792, 693, 709, 450, 367, 376, 550, 1, 787]),
    test(3, aleatoire(12, 1, 1000)),
    test(5, aleatoire(12, 300, 700)),
    test(2, aleatoire(12, 990, 1000)),
]
print(json.dumps(tests))
