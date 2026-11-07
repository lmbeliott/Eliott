import json, random
random.seed(2026)

def test(iv):
    return f"{len(iv)}\n" + "".join(f"{a} {b}\n" for a, b in iv)

def aleatoire(n, maxc, maxl):
    iv = []
    for _ in range(n):
        a = random.randint(0, maxc)
        iv.append((a, min(maxc, a + random.randint(0, maxl))))
    return iv

tests = [test([(1, 4), (2, 6), (8, 9), (3, 5), (7, 10)]), test([(0, 10), (1, 2), (5, 6)])]
tests.append(test([(5, 5)]))
tests.append(test([(3, 3), (3, 3), (3, 3)]))
tests.append(test([(i, i) for i in range(0, 40, 2)]))         # aucun chevauchement
tests.append(test([(0, 10**6), (10**6, 10**6), (0, 0)]))
tests.append(test([(i, 100 - i) for i in range(50)]))         # intervalles emboîtés
tests.append(test(aleatoire(30, 50, 10)))
tests.append(test(aleatoire(10000, 10**5, 30)))
tests.append(test(aleatoire(8000, 10**6, 100000)))
# beaucoup de petits intervalles et quelques grands qui piègent le tri par début
iv = aleatoire(7000, 10**6, 50) + [(random.randint(0, 1000), random.randint(999000, 10**6)) for _ in range(1000)]
random.shuffle(iv)
tests.append(test(iv))
print(json.dumps(tests))
