import json, random
from math import gcd
random.seed(4306)


def couples(nb, borne):
    out = []
    while len(out) < nb:
        p, q = random.randint(1, borne), random.randint(1, borne)
        if gcd(p, q) == 1:
            out.append((p, q))
    return out


def texte(c):
    return f"{len(c)}\n" + "".join(f"{p} {q}\n" for p, q in c)


F = [1, 1]
while F[-1] < 10 ** 18:
    F.append(F[-1] + F[-2])
tests = [texte([(3, 5), (7, 2), (1, 1)]), texte([(13, 8), (1, 4)])]
tests.append(texte([(1, 1)]))
tests.append(texte([(10 ** 18, 1), (1, 10 ** 18), (10 ** 18 - 1, 10 ** 18), (10 ** 18, 10 ** 18 - 1)]))
tests.append(texte([(F[-2], F[-3]), (F[-3], F[-2]), (F[40], F[41])]))  # quotients tous égaux à 1 : beaucoup de blocs
tests.append(texte(couples(20, 30)))
tests.append(texte(couples(200, 1000)))
tests.append(texte(couples(1000, 10 ** 9)))
tests.append(texte(couples(1000, 10 ** 18)))
tests.append(texte([(2, 1), (1, 2), (999999999999999989, 2), (2, 999999999999999989)]))
print(json.dumps(tests))
