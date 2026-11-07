import json, random
random.seed(2026)

def test(a):
    return f"{len(a)}\n" + " ".join(map(str, a)) + "\n"

def hasard(n, maxi):
    return [random.randint(1, maxi) for _ in range(n)]

tests = [
    test([3, 1, 2, 4]),
    test([1, 3, 2, 1, 2, 2]),
]
tests += [
    test([7]),
    test([4, 4, 4, 4]),                                   # déjà triée, tout identique
    test([1, 2, 2, 3, 5, 8]),                             # déjà triée
    test([5, 4, 3, 2, 1]),                                # triée à l'envers
    test([2, 3, 1]),                                      # plus longue sous-suite croissante : faux
    test([2, 1, 2, 1, 2, 1]),
    test([1, 1, 2, 1, 2, 3, 3, 2]),
    test([10, 20, 30, 40, 50, 1]),                        # le minimum est à la fin
    test([1000000, 1, 2, 3, 4, 5, 6, 7, 8, 9]),           # le maximum est au début
    test(hasard(30, 4)),
    test(hasard(500, 10)),
    test(hasard(20000, 3)),
    test(hasard(20000, 1000000)),
]
# grande liste presque triée : des blocs de valeurs égales, quelques éléments mal placés
a = sorted(hasard(20000, 2000))
for _ in range(30):
    i, j = random.randrange(20000), random.randrange(20000)
    a[i], a[j] = a[j], a[i]
tests.append(test(a))
# les petites valeurs en ordre, mélangées à des grandes : la réponse est le nombre de grandes... ou presque
b = list(range(1, 15001)) + [random.randint(15001, 30000) for _ in range(5000)]
random.shuffle(b)
c = sorted(x for x in b if x <= 15000)
tests.append(test([x for x in b if x > 15000][:2500] + c + [x for x in b if x > 15000][2500:]))
print(json.dumps(tests))
