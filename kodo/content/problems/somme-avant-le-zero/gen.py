import json, random
random.seed(2026)

def test(vals):
    return "".join(f"{v}\n" for v in vals) + "0\n"

tests = [test([5, -2, 8]), test([])]
tests.append(test([7]))
tests.append(test([-1000000]))
tests.append(test([3, -3, 4, -4]))          # somme nulle mais 4 valeurs
tests.append(test([1000000] * 1000))         # le plus grand total
tests.append(test([-1000000] * 1000))
for n in [10, 100, 500, 1000, 1000]:
    vals = []
    for _ in range(n):
        v = 0
        while v == 0:
            v = random.randint(-1000000, 1000000)
        vals.append(v)
    tests.append(test(vals))
print(json.dumps(tests))
