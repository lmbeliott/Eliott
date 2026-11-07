import json, random
random.seed(4310)


def texte(cas):
    lignes = []
    for n, d, touches in cas:
        lignes.append(f"{n} {d} {len(touches)} " + " ".join(f"{m} {c}" for m, c in touches))
    return f"{len(cas)}\n" + "\n".join(lignes) + "\n"


def touches_alea(cmax):
    k = random.randint(1, 4)
    return [(random.randint(2, 10), random.randint(1, cmax)) for _ in range(k)]


tests = [texte([(11, 1, [(2, 1), (3, 1)]), (100, 5, [(10, 1)])]),
         texte([(29, 10, [(2, 15), (3, 25), (5, 40)])])]
tests.append(texte([(1, 7, [(2, 1)]), (2, 1, [(2, 5)]), (5, 3, [(2, 1), (3, 1)])]))
tests.append(texte([(n, random.randint(1, 20), touches_alea(50)) for n in range(1, 21)]))
tests.append(texte([(random.randint(1, 1000), random.randint(1, 100), touches_alea(1000)) for _ in range(20)]))
tests.append(texte([(random.randint(1, 10 ** 6), random.randint(1, 10 ** 3), touches_alea(10 ** 6)) for _ in range(20)]))
# grands : N jusqu'à 10¹², avec N × D jusqu'à 10¹⁸
tests.append(texte([(10 ** 12, 10 ** 6, [(2, 10 ** 6), (3, 999999), (5, 7), (7, 1)]),
                    (999999999989, 10 ** 6, [(2, 1), (3, 1), (5, 1), (7, 1)]),
                    (10 ** 12, 1, [(2, 10 ** 6), (3, 10 ** 6), (5, 10 ** 6), (7, 10 ** 6)]),
                    (10 ** 12 - 1, 1, [(6, 50), (8, 50), (9, 50), (10, 50)])]))
tests.append(texte([(random.randint(10 ** 11, 10 ** 12), random.randint(1, 10 ** 6), touches_alea(10 ** 6)) for _ in range(20)]))
tests.append(texte([(random.randint(1, 10 ** 12), random.randint(1, 10), touches_alea(10 ** 6)) for _ in range(20)]))
tests.append(texte([(10 ** 12, 10 ** 6, [(10, 10 ** 6)]), (10 ** 12, 10 ** 6, [(9, 1), (10, 10 ** 6)]),
                    (777777777777, 123456, [(2, 999999), (3, 31), (4, 999999), (7, 10)])]))
print(json.dumps(tests))
