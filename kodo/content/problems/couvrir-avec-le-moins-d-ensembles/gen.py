import json, random
random.seed(2042)

def test(m, ens):
    return f"{len(ens)} {m}\n" + "\n".join(" ".join(map(str, [len(e)] + sorted(e))) for e in ens) + "\n"

def hasard(n, m, p):
    ens = [[q for q in range(1, m + 1) if random.random() < p] for _ in range(n)]
    for q in range(1, m + 1):                 # chaque quartier est couvert au moins une fois
        if not any(q in e for e in ens):
            random.choice(ens).append(q)
    return ens

tests = []
tests.append(test(6, [[1, 2, 3], [3, 4], [4, 5, 6], [1, 5], [2, 6]]))
tests.append(test(4, [[1, 2], [3], [2, 3]]))
tests.append(test(1, [[1]]))
tests.append(test(1, [[]]))
tests.append(test(30, [list(range(1, 31))] * 18))
tests.append(test(18, [[i] for i in range(1, 19)]))
tests.append(test(30, hasard(18, 30, 0.1)))
tests.append(test(30, hasard(18, 30, 0.2)))
tests.append(test(30, hasard(18, 30, 0.35)))
tests.append(test(30, hasard(18, 29, 0.15)))
tests.append(test(30, hasard(18, 30, 0.05)))
# chaque quartier est couvert par exactement deux emplacements
ens = [[] for _ in range(18)]
for q in range(1, 31):
    for i in random.sample(range(18), 2):
        ens[i].append(q)
tests.append(test(30, ens))
tests.append(test(10, hasard(7, 10, 0.3)))
tests.append(test(20, hasard(12, 20, 0.25)))
print(json.dumps(tests))
