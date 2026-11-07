import json, random
random.seed(2026)

def make(d):
    return f"{len(d)}\n" + " ".join(map(str, d)) + "\n"

tests = [make([4, 0, 7, 2]), make([5, 5])]
tests.append(make([0]))
tests.append(make([9]))
tests.append(make([0] * 1000))
tests.append(make([9] * 1000))
tests.append(make([1, 2, 3, 4]))
tests.append(make([1, 0, 0, 0, 0, 0, 0, 0, 0, 1]))
for n in [6, 13, 200, 1000]:
    tests.append(make([random.randint(0, 9) for _ in range(n)]))
print(json.dumps(tests))
