import json, random
random.seed(4205)


def texte(n, aff):
    return f"{n} {len(aff)}\n" + "".join(f"{l} {r} {p}\n" for l, r, p in aff)


def vraies(n, q, bits, largeur=None):
    # affirmations vraies pour la suite cachée (bits : fonction position -> bit, préfixes calculés à la demande)
    out = []
    for _ in range(q):
        l = random.randint(1, n)
        r = random.randint(l, n if largeur is None else min(n, l + largeur))
        out.append((l, r, bits(l, r)))
    return out


def suite(n):
    b = [0] + [random.randint(0, 1) for _ in range(n)]
    pre = [0] * (n + 1)
    for i in range(1, n + 1):
        pre[i] = pre[i - 1] ^ b[i]
    return lambda l, r: pre[r] ^ pre[l - 1]


tests = []
tests.append(texte(6, [(1, 2, 1), (3, 4, 0), (1, 4, 1), (2, 3, 1), (1, 3, 0), (2, 4, 1)]))
tests.append(texte(1, [(1, 1, 0), (1, 1, 1)]))
tests.append(texte(5, [(2, 4, 1)]))
tests.append(texte(3, [(1, 3, 0), (1, 3, 0), (1, 1, 1), (2, 3, 1), (2, 2, 0), (3, 3, 0)]))
for n, q in [(6, 10), (10, 20), (30, 40), (100, 200)]:
    f = suite(n)
    aff = vraies(n, q, f)
    k = random.randint(0, q - 1)
    l, r, p = aff[k]
    aff[k] = (l, r, random.randint(0, 1))  # peut devenir fausse
    tests.append(texte(n, aff))
# grands
n = 10 ** 5
f = suite(n)
tests.append(texte(n, vraies(n, 8000, f)))  # tout est cohérent
# fausse affirmation tardive, déjà déductible des précédentes (2 000 positions seulement)
n = 10 ** 5
pos = sorted(random.sample(range(0, n + 1), 2000))
cache = {x: random.randint(0, 1) for x in pos}
aff = []
for _ in range(8000):
    a, b = sorted(random.sample(pos, 2))
    aff.append((a + 1, b, cache[a] ^ cache[b]))
l, r, p = aff[7654]
aff[7654] = (l, r, 1 - p)
tests.append(texte(n, aff))
# N = 10⁹ : il faut renuméroter les positions
n = 10 ** 9
pos = sorted(random.sample(range(0, n + 1), 3000))
cache = {x: random.randint(0, 1) for x in pos}
aff = []
for _ in range(6999):
    a, b = sorted(random.sample(pos, 2))
    aff.append((a + 1, b, cache[a] ^ cache[b]))
aff.append((pos[0] + 1, pos[-1], 1 - (cache[pos[0]] ^ cache[pos[-1]])))
tests.append(texte(n, aff))
print(json.dumps(tests))
