import json, random
random.seed(2026)

def test(c, poids):
    return f"{len(poids)} {c}\n" + " ".join(map(str, poids)) + "\n"

def aleatoire(n, lo, hi):
    return [random.randint(lo, hi) for _ in range(n)]

tests = [
    test(150, [80, 50, 120, 95, 60, 70]),
    test(100, [60, 60, 60]),
    test(200, [130]),                         # une seule personne
    test(100, [50, 50]),                      # pile la charge maximale
    test(100, [51, 50]),
    test(300, [150] * 9),                     # tout identique, nombre impair
    test(400, [400, 1, 399, 2, 200, 200, 201]),
    test(100, [90, 10, 80, 20]),              # apparier deux voisins après le tri ne suffit pas
    test(250, aleatoire(15, 40, 200)),
]
tests.append(test(300, aleatoire(2000, 30, 290)))
tests.append(test(400, aleatoire(5000, 100, 300)))
# tailles maximales
tests.append(test(300, aleatoire(30000, 40, 260)))
tests.append(test(300, aleatoire(30000, 100, 290)))
print(json.dumps(tests))
