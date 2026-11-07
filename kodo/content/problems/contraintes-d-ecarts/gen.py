import json, random
random.seed(4104)


def texte(n, cs):
    return f"{n} {len(cs)}\n" + "".join(f"{a} {b} {c}\n" for a, b, c in cs)


def alea(n, m, cmin, cmax):
    return [(random.randint(1, n), random.randint(1, n), random.randint(cmin, cmax)) for _ in range(m)]


def depuis_solution(n, m, vmax, marge):
    # contraintes vérifiées par une solution cachée : il y a toujours une solution
    x = [0] + [random.randint(-vmax, vmax) for _ in range(n)]
    cs = []
    for _ in range(m):
        a, b = random.randint(1, n), random.randint(1, n)
        cs.append((a, b, x[b] - x[a] + random.randint(0, marge)))
    return cs


tests = []
tests.append(texte(3, [(1, 2, 5), (2, 3, 2), (1, 3, 9), (3, 1, -4)]))
tests.append(texte(2, [(1, 2, 3), (2, 1, -4)]))
tests.append(texte(3, [(3, 1, 2)]))
tests.append(texte(1, []))
tests.append(texte(1, [(1, 1, -1)]))
tests.append(texte(2, [(1, 2, -5), (2, 2, 0)]))
tests.append(texte(4, [(1, 2, 1), (2, 3, 1), (3, 2, -1), (2, 4, 6), (4, 1, -3)]))
for n, m in [(5, 8), (8, 20), (20, 60)]:
    tests.append(texte(n, depuis_solution(n, m, 20, 3)))
tests.append(texte(10, alea(10, 25, -3, 10)))
# grands : longue chaîne d'égalités x[i+1] - x[i] = d, donnée à l'envers (beaucoup de tours)
n = 300
d = [random.randint(-10 ** 6, 10 ** 6) for _ in range(n)]
cs = []
for i in range(n - 1, 0, -1):
    cs.append((i, i + 1, d[i]))
    cs.append((i + 1, i, -d[i]))
cs += depuis_solution(n, 0, 0, 0)
x = [0] * (n + 1)
for i in range(1, n):
    x[i + 1] = x[i] + d[i]
for _ in range(2400):
    a, b = random.randint(1, n), random.randint(1, n)
    cs.append((a, b, x[b] - x[a] + random.randint(0, 10 ** 6)))
tests.append(texte(n, cs))
# grand, avec une solution
n = 300
tests.append(texte(n, depuis_solution(n, 3000, 10 ** 5, 10 ** 5)))
# cycle de longueur -1 sur les 300 sommets, plus des contraintes larges
n = 300
perm = random.sample(range(1, n + 1), n)
cs = [(perm[i], perm[(i + 1) % n], 0) for i in range(n)]
k = random.randrange(n)
cs[k] = (cs[k][0], cs[k][1], -1)
cs += [(random.randint(1, n), random.randint(1, n), random.randint(0, 10 ** 6)) for _ in range(2700)]
random.shuffle(cs)
tests.append(texte(n, cs))
# grand, N jamais contraint par 1 : INFINI
n = 300
cs = depuis_solution(n, 3000, 10 ** 5, 10)
cs = [(a, b, c) for a, b, c in cs if a != 1 and b != n]
tests.append(texte(n, cs))
print(json.dumps(tests))
