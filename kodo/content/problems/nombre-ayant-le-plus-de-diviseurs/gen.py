import json, random
random.seed(2026)

def test(vals):
    return f"{len(vals)}\n" + "".join(f"{v}\n" for v in vals)

tests = [test([13, 12, 36, 7]), test([10, 6, 15])]
tests.append(test([1]))
tests.append(test([1000000]))
tests.append(test([999983, 1, 7]))              # nombres premiers et 1
tests.append(test([720720, 831600, 942480, 997920, 982800]))  # beaucoup de diviseurs
tests.append(test([36, 49, 100, 64]))            # des carrés
tests.append(test([997920, 720720] + [random.randint(1, 10**6) for _ in range(98)]))
for _ in range(4):
    tests.append(test([random.randint(1, 10**6) for _ in range(100)]))
tests.append(test([999999 - i for i in range(100)]))
print(json.dumps(tests))
