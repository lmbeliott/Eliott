import json, random
random.seed(2026)


def ambigu(vals):
    # la moyenne exacte vaut k + 1/2 centièmes : 200 * S / N est un entier impair
    s, n = sum(vals), len(vals)
    return (200 * s) % n == 0 and (200 * s // n) % 2 == 1


def test(vals):
    assert not ambigu(vals)
    return f"{len(vals)}\n" + " ".join(map(str, vals)) + "\n"


tests = [test([12, 15, 14]), test([5, 5, 5, 5])]
tests.append(test([0]))
tests.append(test([1000000]))
tests.append(test([1, 2]))                  # 1.50
tests.append(test([0, 0, 1]))               # 0.33
tests.append(test([2, 2, 3]))               # 2.33
tests.append(test([1000000] * 999 + [999999]))
tests.append(test([1, 0, 0, 0, 0, 0]))      # 0.17
for n, m in [(10, 20), (100, 1000), (1000, 1000000), (1000, 1000000), (7, 100)]:
    while True:
        vals = [random.randint(0, m) for _ in range(n)]
        if not ambigu(vals):
            break
    tests.append(test(vals))
print(json.dumps(tests))
