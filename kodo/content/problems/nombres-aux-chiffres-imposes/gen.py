import json, random
random.seed(2026)

G = 10**18

def test(questions):
    return f"{len(questions)}\n" + "".join(f"{d} {a} {b}\n" for d, a, b in questions)

def chiffres_au_hasard():
    k = random.randint(1, 10)
    return "".join(sorted(random.sample("0123456789", k)))

def hasard(q, maxi):
    qs = []
    for _ in range(q):
        a = random.randint(1, maxi)
        b = random.randint(1, maxi)
        qs.append((chiffres_au_hasard(), min(a, b), max(a, b)))
    return test(qs)

def ecrit_avec(d, longueur):
    # un nombre de cette longueur écrit avec les chiffres de d (premier chiffre non nul)
    non_nuls = [c for c in d if c != "0"]
    return int(random.choice(non_nuls) + "".join(random.choice(d) for _ in range(longueur - 1)))

tests = [
    test([("27", 1, 100), ("05", 1, 600)]),
    test([("13", 10, 31), ("0123456789", 5, 20), ("9", 1, 1000)]),
]
tests += [
    test([("0", 1, G), ("0", 1, 1)]),                         # aucun nombre possible
    test([("0123456789", 1, G), ("0123456789", G, G), ("123456789", 1, G)]),
    test([("1", 1, G), ("1", 111, 111), ("1", 112, 1110), ("01", 1, G)]),
    test([("5", 5, 5), ("5", 6, 54), ("05", 500, 505), ("05", 501, 504)]),   # bornes exactes
    test([("08", 1, G), ("9", 1, G - 1), ("89", 999999999999999998, 999999999999999999)]),
    test([("2357", 1, 10**9), ("2357", 10**9, G), ("0246", 1, G), ("13579", 10**17, G)]),
    test([("0123456789", 1, 1), ("12", 1, 2), ("012", 3, 9)]),
    hasard(20, 1000),
    hasard(20, 10**6),
    hasard(20, G),
]
qs = []
for _ in range(20):
    d = chiffres_au_hasard()
    if d == "0":
        d = "07"
    a = ecrit_avec(d, random.randint(1, 18))
    b = ecrit_avec(d, random.randint(1, 18))
    qs.append((d, min(a, b), max(a, b)))
tests.append(test(qs))     # des bornes elles-mêmes écrites avec les chiffres autorisés
print(json.dumps(tests))
