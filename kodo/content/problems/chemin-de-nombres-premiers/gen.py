import json, random
random.seed(2036)

LIMITE = 100000
premier = [True] * LIMITE
premier[0] = premier[1] = False
for i in range(2, 317):
    if premier[i]:
        for j in range(i * i, LIMITE, i):
            premier[j] = False

def premiers(d):
    return [p for p in range(max(2, 10 ** (d - 1)), 10 ** d) if premier[p]]

def test(a, b, interdits):
    return f"{a} {b}\n{len(interdits)}\n{' '.join(map(str, interdits))}\n"

def voisins(x, d):
    s = str(x)
    res = []
    for i in range(d):
        for c in "0123456789":
            if c != s[i] and not (i == 0 and c == "0"):
                y = int(s[:i] + c + s[i + 1:])
                if premier[y]:
                    res.append(y)
    return res

tests = []
tests.append(test(13, 89, []))
tests.append(test(1033, 8179, [1733, 3733]))
tests.append(test(7, 7, []))
tests.append(test(2, 5, []))
tests.append(test(11, 97, [17, 19, 71, 31, 41, 61, 13]))
# B entouré d'interdits : impossible
b = 99991
tests.append(test(10007, b, voisins(b, 5)))
a = 13
tests.append(test(a, 97, voisins(a, 2)))
# interdits au hasard, grands cas
P5 = premiers(5)
for nb in [0, 300, 1000, 1000]:
    a, b = random.sample(P5, 2)
    reste = [p for p in P5 if p != a and p != b]
    tests.append(test(a, b, random.sample(reste, nb)))
# chercher une paire très éloignée sans interdit
tests.append(test(10007, 99877, []))
P4 = premiers(4)
a, b = random.sample(P4, 2)
tests.append(test(a, b, random.sample([p for p in P4 if p != a and p != b], 500)))
P3 = premiers(3)
a, b = random.sample(P3, 2)
tests.append(test(a, b, random.sample([p for p in P3 if p != a and p != b], 60)))
print(json.dumps(tests))
