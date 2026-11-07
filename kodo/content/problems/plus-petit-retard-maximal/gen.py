import json, random
random.seed(2026)

def test(cmds):
    return f"{len(cmds)}\n" + "".join(f"{p} {d}\n" for p, d in cmds)

tests = [test([(10, 10), (1, 20)]), test([(3, 5), (2, 4), (4, 12), (1, 3), (5, 9)])]
tests.append(test([(7, 0)]))
tests.append(test([(5, 100)]))
tests.append(test([(2, 0), (3, 0), (1, 0)]))
tests.append(test([(1000, 10**7)] * 20))
# pièges : le plus court d'abord, ou la plus petite marge d - p d'abord
tests.append(test([(1, 5), (4, 4), (2, 10), (3, 6)]))
tests.append(test([(random.randint(1, 10), random.randint(0, 50)) for _ in range(12)]))
tests.append(test([(random.randint(1, 1000), random.randint(0, 6 * 10**6)) for _ in range(10000)]))
tests.append(test([(random.randint(1, 1000), random.randint(0, 3 * 10**6)) for _ in range(10000)]))
tests.append(test([(random.randint(1, 1000), random.randint(2 * 10**6, 3 * 10**6)) for _ in range(9000)]))
print(json.dumps(tests))
