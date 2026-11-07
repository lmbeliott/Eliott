import json, random
random.seed(2026)


def fmt(a):
    return f"{len(a)}\n" + " ".join(map(str, a)) + "\n"


tests = [
    fmt([2, 5, 3, 6, 4]),
    fmt([1, 3, 3, 2, 4, 4]),
]
tests.append(fmt([7]))
tests.append(fmt([1, 2]))
tests.append(fmt([5, 5, 5, 5, 5]))                         # tout égal : 0
tests.append(fmt([9, 8, 7, 6, 5, 4, 3, 2, 1]))             # décroissant : 0
tests.append(fmt(list(range(1, 31))))                      # croissant : C(30, 3)
tests.append(fmt([random.randint(1, 5) for _ in range(40)]))
tests.append(fmt([random.randint(1, 10 ** 6) for _ in range(2000)]))
tests.append(fmt([random.randint(1, 50) for _ in range(5000)]))
# Grands cas : une double boucle est trop lente.
tests.append(fmt([random.randint(1, 10 ** 6) for _ in range(20000)]))
a = list(range(10 ** 6 - 20000 + 1, 10 ** 6 + 1))           # croissant : réponse maximale
tests.append(fmt(a))
# Presque décroissant, avec beaucoup de doublons.
a = sorted((random.randint(1, 300) for _ in range(12000)), reverse=True)
for _ in range(400):
    i, j = random.randrange(12000), random.randrange(12000)
    a[i], a[j] = a[j], a[i]
tests.append(fmt(a))
print(json.dumps(tests))
