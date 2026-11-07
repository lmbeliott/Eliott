import json, random
random.seed(3203)
BORNE = 10**18

def calc(a, b, op):
    return a + b if op == "+" else a - b if op == "-" else a * b

def correcte(nb_nombres, p_mul=0.2):
    # expression correcte avec nb_nombres nombres ; valeurs gardées dans les bornes
    elems, pile = [], []
    restants = nb_nombres
    while restants > 0 or len(pile) > 1:
        if restants > 0 and (len(pile) < 2 or random.random() < 0.5):
            x = random.randint(0, 99)
            elems.append(str(x)); pile.append(x); restants -= 1
        else:
            b = pile.pop(); a = pile.pop()
            op = "*" if random.random() < p_mul else random.choice("+-")
            if abs(calc(a, b, op)) > BORNE:
                op = "-" if (a > 0) == (b > 0) else "+"
            elems.append(op); pile.append(calc(a, b, op))
    return elems

def valide(elems):
    # vérifie que toutes les opérations effectuées restent dans les bornes
    pile = []
    for e in elems:
        if e in "+-*":
            if len(pile) < 2:
                return True
            b = pile.pop(); a = pile.pop()
            r = calc(a, b, e)
            if abs(r) > BORNE:
                return False
            pile.append(r)
        else:
            pile.append(int(e))
    return True

def test(elems):
    assert valide(elems)
    return " ".join(elems) + "\n"

tests = [test("5 1 2 + 4 * + 3 -".split()), test("3 4 + *".split()), test("1 2 3 +".split())]
tests.append(test(["42"]))
tests.append(test(["+"]))
tests.append(test("7 10 -".split()))                       # résultat négatif
tests.append(test("0 5 -".split() + ["3", "*"]))
tests.append(test(["99"] * 9 + ["*"] * 8))                 # 99 puissance 9
tests.append(test(correcte(30)))
e = correcte(500); e.insert(random.randrange(len(e)), "-")
while not valide(e):
    e = correcte(500); e.insert(random.randrange(len(e)), "-")
tests.append(test(e))                                       # un opérateur en trop
# grands tests
tests.append(test(correcte(20000)))
tests.append(test(correcte(20000, 0.05)[:-1]))              # il manque le dernier opérateur
tests.append(test([str(random.randint(0, 99)) for _ in range(20000)] + ["+"] * 19999))
print(json.dumps(tests))
