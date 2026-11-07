import json, random
random.seed(2026)

L = 10**18

def test(t):
    return f"{len(t)}\n{' '.join(map(str, t))}\n"

tests = [test([4, 6, 10]), test([1000000000, 999999999, 7])]
tests.append(test([1]))
tests.append(test([L]))
tests.append(test([L, L - 1]))
tests.append(test([2 ** 59, 2 ** 58, 3]))                 # 2^59 × 3 > 10^18
tests.append(test([2 ** 59, 2 ** 58, 1, 2 ** 10]))       # 2^59
tests.append(test([10**9, 10**9 + 7]))                   # au-dessus de 10^18 de peu
tests.append(test([10**9, 10**9 - 1, 1]))                # juste en dessous
tests.append(test(list(range(1, 44))))                   # PPCM de 1..43 > 10^18
tests.append(test(list(range(1, 43))))                   # PPCM de 1..42 < 10^18
tests.append(test([random.choice([2, 3, 5, 7, 4, 9, 25, 8]) for _ in range(1000)]))
tests.append(test([random.randint(1, L) for _ in range(1000)]))
tests.append(test([random.choice([2 ** 30, 3 ** 18, 5 ** 12, 6 ** 10, 7 ** 5, 10 ** 6]) for _ in range(1000)]))
tests.append(test([random.randint(1, 60) for _ in range(1000)]))
print(json.dumps(tests))
