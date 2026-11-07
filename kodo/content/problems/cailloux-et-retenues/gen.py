import json, random
random.seed(2026)

def test(c):
    return f"{len(c)}\n{' '.join(map(str, c))}\n"

tests = [test([5, 0, 1]), test([3, 3, 3, 3])]
tests.append(test([10**9]))                          # une seule boîte : aucune opération
tests.append(test([0, 0, 0]))
tests.append(test([1, 1, 1, 1]))
tests.append(test([0, 0, 7]))
tests.append(test([2, 1, 1, 1, 1, 1, 0]))            # retenues en cascade
tests.append(test([random.randint(0, 9) for _ in range(30)]))
tests.append(test([random.randint(0, 10**9) for _ in range(500)]))
# grands tests : simuler opération par opération serait bien trop long
tests.append(test([10**9] * 15000))
tests.append(test([random.randint(0, 10**9) for _ in range(15000)]))
tests.append(test([1] * 14999 + [0]))
print(json.dumps(tests))
