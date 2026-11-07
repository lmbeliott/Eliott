import json, random
random.seed(2026)

def test(a, b, c, d):
    return f"{len(a)}\n" + "".join(" ".join(map(str, l)) + "\n" for l in (a, b, c, d))

def hasard(n, m):
    return [random.randint(-m, m) for _ in range(n)]

tests = [test([1, -2], [3, 0], [-1, 2], [0, -2]), test([0, 5, -5], [1, 2, 3], [-1, -2, -3], [0, 0, 5])]
tests.append(test([7], [-7], [3], [-3]))                       # une seule solution
tests.append(test([1], [1], [1], [1]))                         # aucune
tests.append(test([0] * 5, [0] * 5, [0] * 5, [0] * 5))          # 5⁴ quadruplets
tests.append(test([10**8, -10**8], [10**8, -10**8], [10**8, -10**8], [10**8, -10**8]))
tests.append(test(hasard(20, 5), hasard(20, 5), hasard(20, 5), hasard(20, 5)))
tests.append(test(hasard(100, 50), hasard(100, 50), hasard(100, 50), hasard(100, 50)))
# grands tests : N⁴ ou même N³ opérations seraient trop lentes
tests.append(test(hasard(400, 30), hasard(400, 30), hasard(400, 30), hasard(400, 30)))
tests.append(test(hasard(400, 1000), hasard(400, 1000), hasard(400, 1000), hasard(400, 1000)))
tests.append(test(hasard(400, 10**8), hasard(400, 10**8), hasard(400, 10**8), hasard(400, 10**8)))
tests.append(test([0] * 400, [0] * 400, [0] * 400, [0] * 400))  # 400⁴ = 2,56 × 10¹⁰
tests.append(test(hasard(400, 2), hasard(400, 2), hasard(400, 2), hasard(400, 2)))
print(json.dumps(tests))
