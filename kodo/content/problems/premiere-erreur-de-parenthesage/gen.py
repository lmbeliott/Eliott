import json, random
random.seed(3202)
PAIRES = ["()", "[]", "{}"]

def correcte(n):
    # chaîne bien parenthésée de longueur 2n, construite avec une pile
    s, pile = [], []
    ouverts = 0
    while ouverts < n or pile:
        if ouverts < n and (not pile or random.random() < 0.5):
            p = random.choice(PAIRES)
            s.append(p[0]); pile.append(p[1]); ouverts += 1
        else:
            s.append(pile.pop())
    return "".join(s)

def abime(s):
    t = list(s)
    i = random.randrange(len(t))
    t[i] = random.choice("()[]{}")
    return "".join(t)

tests = ["([]{()})\n", "([)]\n", "(()[\n"]
tests.append(")\n")                         # fermant sans ouvrant
tests.append("(\n")                         # ouvrant jamais refermé
tests.append("{}[]()\n")
tests.append("((((]\n")
tests.append("[[]](()\n")                   # le plus à gauche des ouvrants restants
tests.append(abime(correcte(20)) + "\n")
tests.append(correcte(500) + "\n")
# grands tests
tests.append(correcte(50000) + "\n")
grand = correcte(49990)
tests.append(grand[:70000] + "]" + grand[70000:] + "\n")
tests.append("(" * 30000 + correcte(20000) + "\n")
print(json.dumps(tests))
