import json, random, sys
random.seed(3208)
sys.setrecursionlimit(10000)
BORNE = 10**18

def nombre():
    return random.choice([random.randint(0, 9), random.randint(0, 999)])

def expr(prof, taille):
    # renvoie (texte, valeur) ; taille ~ nombre de nombres voulus
    nb_termes = random.randint(1, max(1, min(taille, 6)))
    texte, val = terme(prof, max(1, taille // nb_termes))
    for _ in range(nb_termes - 1):
        t2, v2 = terme(prof, max(1, taille // nb_termes))
        op = random.choice("+-")
        r = val + v2 if op == "+" else val - v2
        if abs(r) > BORNE:
            op = "-" if op == "+" else "+"
            r = val + v2 if op == "+" else val - v2
        texte += op + t2
        val = r
    return texte, val

def terme(prof, taille):
    nb = random.randint(1, 3)
    texte, val = facteur(prof, max(1, taille // nb))
    for _ in range(nb - 1):
        t2, v2 = facteur(prof, max(1, taille // nb))
        if abs(val * v2) > BORNE:
            continue
        texte += "*" + t2
        val = val * v2
    return texte, val

def facteur(prof, taille):
    if prof > 0 and taille > 1 and random.random() < 0.6:
        t, v = expr(prof - 1, taille)
        return "(" + t + ")", v
    x = nombre()
    return str(x), x

def evalue(s):
    # évaluation à deux piles avec vérification des bornes
    prio = {"+": 1, "-": 1, "*": 2}
    vals, ops = [], []
    def app():
        o = ops.pop(); b = vals.pop(); a = vals.pop()
        r = a + b if o == "+" else a - b if o == "-" else a * b
        assert abs(r) <= BORNE
        vals.append(r)
    i = 0
    while i < len(s):
        c = s[i]
        if c.isdigit():
            j = i
            while j < len(s) and s[j].isdigit():
                j += 1
            vals.append(int(s[i:j])); i = j; continue
        if c == "(":
            ops.append(c)
        elif c == ")":
            while ops[-1] != "(":
                app()
            ops.pop()
        else:
            while ops and ops[-1] != "(" and prio[ops[-1]] >= prio[c]:
                app()
            ops.append(c)
        i += 1
    while ops:
        app()
    assert len(vals) == 1
    return vals[0]

def profond(n):
    # imbrication profonde : (1+(2*(3-(4+...))))
    gauche, droite = [], []
    for k in range(n):
        gauche.append(str(random.randint(0, 9)) + random.choice("+-") + "(")
        droite.append(")")
    return "".join(gauche) + "7" + "".join(droite)

def grand(cible):
    # une longue somme de morceaux entre parenthèses ; le signe garde le total petit
    s, total = "", 0
    while len(s) < cible:
        t, v = expr(6, 40)
        if abs(v) > 10**15:
            continue
        if s == "":
            s, total = "(" + t + ")", v
        elif total > 0:
            s, total = s + "-(" + t + ")", total - v
        else:
            s, total = s + "+(" + t + ")", total + v
    return s

tests = ["2+3*4\n", "(2+3)*4-10-4-3\n", "7*(8-(1+2)*5)\n"]
tests.append("0\n")
tests.append("999*999*999*999*999*999\n")
tests.append("1-2-3-4-5\n")
tests.append("((((((42))))))\n")
tests.append("2*3+4*5-6*7\n")
for _ in range(3):
    tests.append(expr(4, 30)[0] + "\n")
tests.append(expr(8, 600)[0] + "\n")
# grands tests
tests.append(grand(97000) + "\n")
tests.append(profond(19999) + "\n")
tests.append("1" + "-1" * 49000 + "\n")
for t in tests:
    assert len(t) - 1 <= 100000
    evalue(t.strip())
print(json.dumps(tests))
