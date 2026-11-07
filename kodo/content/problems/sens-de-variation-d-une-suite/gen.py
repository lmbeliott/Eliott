import json, random
random.seed(2026)

def make(vals):
    return f"{len(vals)}\n" + "".join(f"{x}\n" for x in vals)

tests = [make([1, 3, 3, 5]), make([8, 8, 8]), make([9, 4, 4, -2]), make([2, 5, 1])]
tests.append(make([42]))
tests.append(make([1, 2]))
tests.append(make([2, 1]))
tests.append(make([5, 5, 5, 5, 6]))
tests.append(make([5, 5, 5, 5, 4]))
tests.append(make([1, 2, 3, 4, 3]))
tests.append(make(list(range(-500, 500))))
tests.append(make(list(range(1000000, 999000, -1))))
tests.append(make([7] * 1000))
tests.append(make([random.randint(-10**6, 10**6) for _ in range(1000)]))
print(json.dumps(tests))
