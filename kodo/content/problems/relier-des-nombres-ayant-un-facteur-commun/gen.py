import json, random
random.seed(4308)

VMAX = 100000
est = [True] * (VMAX + 1)
for i in range(2, 317):
    if est[i]:
        for j in range(i * i, VMAX + 1, i):
            est[j] = False
premiers = [p for p in range(2, VMAX + 1) if est[p]]


def texte(a):
    return f"{len(a)}\n" + " ".join(map(str, a)) + "\n"


def lisse(borne, petits):
    while True:
        x = 1
        for _ in range(random.randint(1, 5)):
            x *= random.choice(petits)
        if 2 <= x <= borne:
            return x


tests = [texte([6, 10, 15, 35, 4]), texte([4, 9, 6, 35])]
tests.append(texte([5]))
tests.append(texte([7, 7, 7]))
tests.append(texte([2, 3]))
tests.append(texte([210, 2, 3, 5, 77, 11 * 13, 13 * 17]))
for n in [8, 15, 40]:
    tests.append(texte([lisse(100, [2, 3, 5, 7]) for _ in range(n)]))
tests.append(texte([random.randint(2, 100) for _ in range(200)]))
# grands
n = 25000
tests.append(texte([random.randint(2, VMAX) for _ in range(n)]))           # sans doute non connexe
tests.append(texte([lisse(VMAX, [2, 3, 5, 7, 11, 13]) for _ in range(n)]))  # tous les nombres sont liés par 2, 3...
a = [2 * random.randint(25000, VMAX // 2) for _ in range(n - 1)] + [99999]
tests.append(texte(a))  # 99 999 = 3² × 41 × 271 n'est relié qu'aux multiples de 6, 82 ou 542 ; total > 2³¹
print(json.dumps(tests))
