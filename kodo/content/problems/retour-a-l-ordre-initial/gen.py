import json, random
random.seed(4302)


def avec_cycles(longueurs):
    n = sum(longueurs)
    etiquettes = list(range(1, n + 1))
    random.shuffle(etiquettes)
    p = [0] * (n + 1)
    i = 0
    for l in longueurs:
        c = etiquettes[i:i + l]
        i += l
        for j in range(l):
            p[c[j]] = c[(j + 1) % l]
    return f"{n}\n" + " ".join(map(str, p[1:])) + "\n"


def premiers(borne):
    est = [True] * (borne + 1)
    res = []
    for i in range(2, borne + 1):
        if est[i]:
            res.append(i)
            for j in range(i * i, borne + 1, i):
                est[j] = False
    return res


tests = ["5\n2 3 1 5 4\n", "6\n1 2 3 4 5 6\n"]
tests.append("1\n1\n")
tests.append(avec_cycles([4, 6, 9]))
tests.append(avec_cycles([7] * 3 + [1]))
for n in [8, 12, 40]:
    p = list(range(1, n + 1))
    random.shuffle(p)
    tests.append(f"{n}\n" + " ".join(map(str, p)) + "\n")
# grands : des cycles de longueurs premières distinctes, le PPCM est gigantesque
ps = premiers(2000)
longueurs, total = [], 0
for q in ps:
    if total + q > 20000:
        break
    longueurs.append(q)
    total += q
longueurs.append(20000 - total)
tests.append(avec_cycles(longueurs))
# puissances de nombres premiers et répétitions
longueurs = [1024, 729, 625, 343, 121, 169, 289, 361] * 2
longueurs += [1] * (15000 - sum(longueurs))
tests.append(avec_cycles(longueurs))
# un seul grand cycle
tests.append(avec_cycles([9973]))
# permutation aléatoire
p = list(range(1, 20001))
random.shuffle(p)
tests.append("20000\n" + " ".join(map(str, p)) + "\n")
print(json.dumps(tests))
