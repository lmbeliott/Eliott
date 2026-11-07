import json, random
random.seed(2026)

def test(t):
    return f"{len(t)}\n{' '.join(map(str, t))}\n"

tests = [test([3, 30, 34]), test([9, 34, 5, 30, 3])]
tests.append(test([0]))
tests.append(test([0, 0, 0]))
tests.append(test([0, 10, 100, 1000]))
tests.append(test([121, 12, 1212, 1, 2]))
tests.append(test([9, 98, 989, 9899, 99, 8, 89]))
tests.append(test([10**9, 999999999, 9, 0]))
tests.append(test([random.randint(0, 100) for _ in range(30)]))
tests.append(test([random.randint(0, 10**9) for _ in range(10000)]))
# beaucoup de nombres qui commencent pareil
base = [random.choice(["9", "98", "989", "99", "8", "89", "898", "9898"]) for _ in range(5000)]
tests.append(test([int(b + random.choice(["", "9", "8", "98"])) for b in base]))
tests.append(test([random.choice([0, 1, 10, 100, 11, 101, 110]) for _ in range(5000)]))
print(json.dumps(tests))
