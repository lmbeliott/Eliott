import json, random
random.seed(2026)

def test(motif, mots):
    return f"{motif}\n{' '.join(mots)}\n"

def mot():
    return "".join(random.choice("abcdefghij") for _ in range(random.randint(1, 4)))

def correspondance(motif):
    lettres = sorted(set(motif))
    mots = []
    while len(mots) < len(lettres):
        m = mot()
        if m not in mots:
            mots.append(m)
    d = dict(zip(lettres, mots))
    return [d[c] for c in motif]

tests = [test("abba", "chat chien chien chat".split()),
         test("abba", "chat chien chien chien".split()),
         test("ab", "chat chat".split())]
tests.append(test("a", ["mot"]))
tests.append(test("aa", "chat chien".split()))
tests.append(test("abc", "un deux".split()))                  # pas le même nombre
tests.append(test("ab", "un deux trois".split()))
tests.append(test("xyzx", "a b c a".split()))
tests.append(test("aaaa", "z z z z".split()))
for longueur, nb in [(50, 5), (1000, 26), (1000, 3)]:
    motif = "".join(random.choice("abcdefghijklmnopqrstuvwxyz"[:nb]) for _ in range(longueur))
    tests.append(test(motif, correspondance(motif)))          # OUI
# NON : un seul mot modifié, ou deux lettres envoyées sur le même mot
motif = "".join(random.choice("abcdefghijklmnopqrstuvwxyz") for _ in range(1000))
mots = correspondance(motif)
i = 777
autre = mots[[j for j in range(1000) if motif[j] != motif[i]][0]]
mots[i] = autre
tests.append(test(motif, mots))
motif = "".join(random.choice("abcdefghijklmnopqrstuvwxyz") for _ in range(1000))
mots = correspondance(motif)
mots = [mots[motif.index("b")] if c == "q" else m for c, m in zip(motif, mots)]
tests.append(test(motif, mots))
print(json.dumps(tests))
