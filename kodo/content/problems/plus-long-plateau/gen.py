import json, random
random.seed(2026)

def test(vals):
    return "".join(f"{v}\n" for v in vals) + "-1\n"

tests = [test([4, 4, 7, 7, 7, 2, 7]), test([5, 1, 1, 3, 3])]
tests.append(test([0]))
tests.append(test([9, 8, 7, 6]))                 # que des plateaux de longueur 1
tests.append(test([2, 1, 1, 1]))                 # le plus long est à la fin
tests.append(test([6] * 10000))                  # un seul plateau, le plus long possible
tests.append(test([3, 3, 5, 5, 3, 3, 3, 0, 0, 0]))
tests.append(test([1000000000, 1000000000, 0, 0]))
for n, k in [(100, 3), (2000, 2), (10000, 4), (10000, 2)]:
    tests.append(test([random.randint(0, k - 1) for _ in range(n)]))
print(json.dumps(tests))
