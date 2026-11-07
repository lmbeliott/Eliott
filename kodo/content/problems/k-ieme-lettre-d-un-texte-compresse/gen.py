import json, random, sys
random.seed(2026)
sys.setrecursionlimit(10000)
LIM = 10**18

def longueur(s):
    # longueur du texte développé (vérification du générateur)
    pile = [[0, 1]]   # [longueur accumulée, multiplicateur]
    i = 0
    while i < len(s):
        c = s[i]
        if c.isdigit():
            j = i
            while s[j].isdigit():
                j += 1
            pile.append([0, int(s[i:j])])
            i = j + 1      # saute '('
            continue
        if c == ")":
            l, m = pile.pop()
            pile[-1][0] += l * m
        else:
            pile[-1][0] += 1
        i += 1
    return pile[0][0]

def gen(budget, taille, prof):
    # texte de longueur développée <= budget, d'environ 'taille' caractères
    morceaux = []
    reste = budget
    while taille > 0 and reste > 0:
        if prof > 0 and taille >= 4 and random.random() < 0.4:
            t = random.randint(1, min(taille - 3, max(1, taille // 2)))
            b = random.randint(1, reste)
            inner = gen(b, t, prof - 1)
            l = longueur(inner)
            c = random.randint(1, max(1, min(10**9, reste // l)))
            if random.random() < 0.5:
                c = max(1, min(10**9, reste // l))
            if c * l > reste:
                break
            s = f"{c}({inner})"
            morceaux.append(s)
            reste -= c * l
            taille -= len(s)
        else:
            morceaux.append(random.choice("abcdefghijklmnopqrstuvwxyz"[:random.choice([2, 5, 26])]))
            reste -= 1
            taille -= 1
    if not morceaux:
        morceaux.append("x")
    return "".join(morceaux)

def test(s, ks):
    assert len(s) <= 10000 and longueur(s) <= LIM
    return f"{s}\n{len(ks)}\n" + "".join(f"{k}\n" for k in ks)

def requetes(s, q):
    L = longueur(s)
    ks = [1, L] + [random.randint(1, L) for _ in range(q - 2)]
    return ks[:q]

tests = [test("ab3(cd)e", [1, 4, 7, 9]), test("2(x3(yz))w", [1, 2, 7, 8, 14, 15])]
tests.append(test("a", [1]))
tests.append(test("999999998(1000000000(z)ab)", [1, 10**9, 10**9 + 1, 10**9 + 2, 10**9 + 3, 10**18 - 5, 10**18 - 4]))
s = "q"
for i in range(59):
    s = f"2(a{s}b)" if i % 2 else f"1({s})"
tests.append(test(s, requetes(s, 50)))
# chaîne imbriquée très profonde
prof = []
for i in range(1000):
    prof.append(random.choice(["1(", "2(" if i % 20 == 0 else "1("]))
s = "".join(prof) + "k" + ")" * 1000
s = s.replace("(", "(m", 3)
tests.append(test(s, requetes(s, 50)))
tests.append(test("abcdefghij" * 1000, [1, 10000, 5000, 1234, 9999]))
for taille, budget in [(30, 1000), (200, 10**6), (3000, 10**12), (9800, 10**18), (9800, 10**18), (9800, 10**18)]:
    while True:
        s = gen(budget, taille, random.randint(5, 40))
        if len(s) <= 10000:
            break
    tests.append(test(s, requetes(s, 50 if taille > 100 else 10)))
print(json.dumps(tests))
