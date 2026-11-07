import json, random
random.seed(2026)

def test(ns):
    return f"{len(ns)}\n" + "".join(f"{n}\n" for n in ns)

tests = [test([12, 1, 97, 360])]
tests.append(test([10**12, 999999999989, 999983 * 999979, 2 ** 39]))     # puissance, premier, deux grands premiers
tests.append(test([963761198400, 735134400, 1, 2]))                    # beaucoup de diviseurs
tests.append(test([999999000001, 999966000289, 4, 6]))                # 999999000001 premier ? carré de premier
tests.append(test([random.randint(1, 10**12) for _ in range(4)]))
tests.append(test([random.randint(1, 10**6) for _ in range(4)]))
tests.append(test([999999999989, 999999999959, 999999999961, 999999999947]))  # grands premiers
tests.append(test([2 * 499999999979, 3 ** 25, 7 ** 14, 30030 ** 2]))
print(json.dumps(tests))
