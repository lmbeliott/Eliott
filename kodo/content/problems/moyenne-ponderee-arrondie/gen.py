import json, random
random.seed(2026)

def test(lignes):
    return f"{len(lignes)}\n" + "".join(f"{n} {c}\n" for n, c in lignes)

tests = [test([(12, 3), (13, 1)]), test([(15, 2), (8, 1), (11, 3)])]
tests.append(test([(20, 7)]))                       # une seule note
tests.append(test([(0, 1), (0, 10)]))               # moyenne nulle
tests.append(test([(12, 1), (13, 1)]))              # 12,5 exactement
tests.append(test([(13, 3), (14, 1)]))              # 13,25 : le demi monte
tests.append(test([(12, 7), (13, 13)]))             # 12,65 : le demi monte
tests.append(test([(10, 1), (11, 1), (11, 1)]))     # 10,666... -> 10,7
tests.append(test([(20, 10)] * 100))
tests.append(test([(19, 1), (20, 39)]))             # 19,975 -> 20,0
# cas aléatoires dont la moyenne tombe pile sur un demi-dixième
trouves = 0
while trouves < 3:
    lignes = [(random.randint(0, 20), random.randint(1, 10)) for _ in range(random.randint(2, 30))]
    s = sum(n * c for n, c in lignes)
    t = sum(c for n, c in lignes)
    if (20 * s) % t == 0 and (20 * s // t) % 2 == 1:
        tests.append(test(lignes))
        trouves += 1
for _ in range(2):
    tests.append(test([(random.randint(0, 20), random.randint(1, 10)) for _ in range(100)]))
print(json.dumps(tests))
