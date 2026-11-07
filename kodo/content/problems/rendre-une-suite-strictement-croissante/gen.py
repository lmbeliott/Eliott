import json, random
random.seed(2026)


def fmt(a):
    return f"{len(a)}\n" + " ".join(map(str, a)) + "\n"


def presque_croissante(n, bruit, pas_max):
    # Une suite strictement croissante, dont une partie des valeurs est brouillée.
    a, v = [], random.randint(1, 3)
    for _ in range(n):
        a.append(v)
        v += random.randint(1, pas_max)
    for _ in range(bruit):
        i = random.randrange(n)
        a[i] = max(1, a[i] + random.randint(-50, 50))
    return a


tests = [
    fmt([2, 9, 3, 3, 7, 4, 10, 8]),
    fmt([3, 1, 2]),
]
tests.append(fmt([1]))
tests.append(fmt([1000000000]))
tests.append(fmt([1, 2, 2, 3, 4]))                    # la plus longue sous-suite croissante ne suffit pas
tests.append(fmt([5, 5, 5, 5, 5]))
tests.append(fmt([1, 3, 5, 7, 9, 11]))
tests.append(fmt([9, 8, 7, 6, 5, 4, 3, 2, 1]))
tests.append(fmt([10, 1, 2, 3, 4, 5, 6, 20, 21]))     # garder 10 ou garder 1, 2, 3… ?
tests.append(fmt([random.randint(1, 10 ** 9) for _ in range(1000)]))
tests.append(fmt(presque_croissante(3000, 1500, 30)))
# Grands cas : des pas de 1 ou 2 (beaucoup d'égalités entre les a[i] - i), du bruit,
# et beaucoup de petites valeurs inutilisables au début.
tests.append(fmt(presque_croissante(20000, 6000, 2)))
tests.append(fmt([random.randint(1, 30000) for _ in range(20000)]))
a = presque_croissante(20000, 2500, 1)
tests.append(fmt([random.randint(1, 20) if i < 100 else x for i, x in enumerate(a)]))
tests.append(fmt([max(1, i + random.randint(-3, 3)) for i in range(1, 6001)]))
print(json.dumps(tests))
