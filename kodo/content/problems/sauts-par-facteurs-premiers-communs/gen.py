import json, random
random.seed(4108)

VMAX = 100000
est_premier = [True] * (VMAX + 1)
est_premier[0] = est_premier[1] = False
for i in range(2, 317):
    if est_premier[i]:
        for j in range(i * i, VMAX + 1, i):
            est_premier[j] = False
premiers = [p for p in range(2, VMAX + 1) if est_premier[p]]


def texte(c, a):
    return f"{len(a)} {c}\n" + " ".join(map(str, a)) + "\n"


def lisse(borne):
    # un entier ≤ borne formé de petits nombres premiers
    while True:
        x = 1
        for _ in range(random.randint(1, 6)):
            x *= random.choice([2, 3, 5, 7, 11, 13, 17, 19, 23])
        if 2 <= x <= borne:
            return x


tests = [texte(10, [4, 15, 49, 10, 35, 21]), texte(1, [97, 6, 10, 97])]
tests.append(texte(5, [2, 3]))
tests.append(texte(1000000, [99991, 99991]))
tests.append(texte(1000, [6, 35, 77, 143, 221, 323, 437, 667, 899, 31 * 37]))
for n in [8, 12, 30]:
    tests.append(texte(random.randint(1, 30), [random.randint(2, 60) for _ in range(n)]))
tests.append(texte(50, [lisse(1000) for _ in range(200)]))
# grand : tous les nombres sont pairs (un graphe explicite aurait 2 × 10⁸ arêtes)
n = 15000
tests.append(texte(1000000, [15] + [2 * random.randint(1, 50000) for _ in range(n - 1)]))
# grand : 3 000 premiers nombres premiers distincts au début, on doit marcher (réponse > 2³¹)
n = 15000
grands = random.sample(premiers[-6000:], 3000)
a = grands + [lisse(VMAX) for _ in range(n - 3000)]
tests.append(texte(1000000, a))
# grand : nombres aléatoires, marcher coûte peu
n = 15000
tests.append(texte(3, [random.randint(2, VMAX) for _ in range(n)]))
# grand : chaîne de nombres premiers p_i × p_(i+1), il faut enchaîner beaucoup de sauts
n = 15000
ps = random.sample(premiers[100:2000], 1500)
a = []
for i in range(n):
    k = min(i // 13, len(ps) - 2)
    a.append(ps[k] * ps[k + 1] if ps[k] * ps[k + 1] <= VMAX else ps[k])
tests.append(texte(1000000, a))
print(json.dumps(tests))
