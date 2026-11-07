import json, random
random.seed(2026)

L = 10**18

def test(coins, amounts):
    return f"{len(coins)}\n{' '.join(map(str, coins))}\n{len(amounts)}\n" + "".join(f"{s}\n" for s in amounts)

def chaine(maxf):
    c = [1]
    while True:
        f = random.randint(2, maxf)
        if c[-1] * f > L:
            return c
        c.append(c[-1] * f)

tests = [test([1, 5, 10, 50, 100], [0, 7, 99, 280, 1234])]
tests.append(test([1], [0, 1, 10**18]))
tests.append(test([2 ** k for k in range(60)], [L, 2 ** 59 - 1, 2 ** 60 - 1 - 2 ** 59, 12345]))
tests.append(test([1, 3, 9, 27, 81, 243], list(range(0, 50))))
c = chaine(10)
tests.append(test(c, [random.randint(0, L) for _ in range(1000)]))
c = chaine(1000)
tests.append(test(c, [random.randint(0, L) for _ in range(1000)]))
c = [1, 10**9, 10**18]
tests.append(test(c, [L, L - 1, 10**9 - 1, 999999999999999999] + [random.randint(0, L) for _ in range(996)]))
c = chaine(3)
tests.append(test(c, [c[-1] - 1] + [random.randint(0, L) for _ in range(999)]))
print(json.dumps(tests))
