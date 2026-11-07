import json, random
random.seed(2026)

N_MAX = 15000
Q_MAX = 5000
V = 1 << 16


def fmt(a, xs):
    return f"{len(a)}\n" + " ".join(map(str, a)) + f"\n{len(xs)}\n" + " ".join(map(str, xs)) + "\n"


def requetes(a, q, part_formees):
    # Une partie des requêtes est le OU de deux valeurs du tableau, le reste est quelconque
    xs = []
    for _ in range(q):
        if len(a) >= 2 and random.random() < part_formees:
            i, j = random.sample(range(len(a)), 2)
            xs.append(a[i] | a[j])
        else:
            xs.append(random.randrange(V))
    return xs


def peu_de_bits(n, k):
    # Valeurs avec au plus k bits à 1 : beaucoup de OU différents, peu de paires pour chacun
    res = []
    for _ in range(n):
        x = 0
        for _ in range(random.randint(0, k)):
            x |= 1 << random.randrange(16)
        res.append(x)
    return res


tests = [
    fmt([1, 2, 3, 4, 6], [3, 7, 6, 5]),
    fmt([5, 5, 0, 5], [5, 0, 1]),
]
# Cas limites : une seule valeur, que des zéros, que des 65535, valeurs extrêmes
tests.append(fmt([7], [7, 0]))
tests.append(fmt([0] * 10, [0, 1, 65535]))
tests.append(fmt([65535] * 7 + [0], [65535, 0]))
tests.append(fmt([0, 1, 32768, 65535, 65534, 32767], [65535, 32769, 1, 0, 65534, 32767]))
# Petits cas aléatoires
a = [random.randrange(16) for _ in range(30)]
tests.append(fmt(a, list(range(16))))
a = [random.randrange(V) for _ in range(200)]
tests.append(fmt(a, requetes(a, 100, 0.7)))
a = peu_de_bits(500, 3)
tests.append(fmt(a, requetes(a, 300, 0.8)))
# Grands cas : toutes les paires une à une, c'est environ 10⁸ OU à calculer.
a = [random.randrange(V) for _ in range(N_MAX)]
tests.append(fmt(a, requetes(a, Q_MAX, 0.5)))
a = peu_de_bits(N_MAX, 6)
tests.append(fmt(a, requetes(a, Q_MAX, 0.9)))
a = [random.randrange(V) | random.choice([0xF000, 0x0F0F, 0]) for _ in range(10000)]
tests.append(fmt(a, requetes(a, 3000, 0.6)))
print(json.dumps(tests))
