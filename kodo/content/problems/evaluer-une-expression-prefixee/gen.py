import json, random
random.seed(2026)
LIM = 10**18

def test(tokens):
    return f"{len(tokens)}\n{' '.join(tokens)}\n"

def build(n_ops, maxv, ops="+-*"):
    # construit une expression aléatoire avec n_ops opérateurs, en gardant les valeurs bornées
    # renvoie (liste de morceaux, valeur)
    if n_ops == 0:
        v = random.randint(0, maxv)
        return [str(v)], v
    k = random.randint(0, n_ops - 1)
    a, va = build(k, maxv, ops)
    b, vb = build(n_ops - 1 - k, maxv, ops)
    choix = list(ops)
    random.shuffle(choix)
    for op in choix:
        v = va + vb if op == "+" else va - vb if op == "-" else va * vb
        if abs(v) <= LIM:
            return [op] + a + b, v
    return ["+"] + a + b, va + vb

def chaine_gauche(n_ops, ops):
    # op op op ... x x x : profondeur maximale
    toks = [random.choice(ops) for _ in range(n_ops)]
    vals = [str(random.randint(0, 9)) for _ in range(n_ops + 1)]
    return toks + vals

def chaine_droite(n_ops, ops, maxv):
    # op x op x op x ... x : profondeur maximale aussi
    toks = []
    for _ in range(n_ops):
        toks += [random.choice(ops), str(random.randint(0, maxv))]
    toks.append(str(random.randint(0, maxv)))
    return toks

tests = [test("- * 3 4 5".split()), test("* 3 - 4 5".split()), test(["2026"])]
tests.append(test(["0"]))
tests.append(test(["1000000000"]))
tests.append(test("* 1000000000 1000000000".split()))
tests.append(test("- 0 * 1000000000 1000000000".split()))
tests.append(test(chaine_gauche(1999, "+-")))
tests.append(test(chaine_droite(1999, "+-", 10**9)))
tests.append(test(["*"] * 58 + ["2"] * 59))
tests.append(test(chaine_droite(1999, "-", 10**9)))
import sys
sys.setrecursionlimit(10000)
for n_ops in [5, 20, 300, 1999, 1999]:
    toks, _ = build(n_ops, random.choice([9, 1000, 10**9]))
    tests.append(test(toks))
print(json.dumps(tests))
