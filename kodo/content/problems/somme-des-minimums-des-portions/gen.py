import json, random
random.seed(3207)

def test(a):
    return f"{len(a)}\n{' '.join(map(str, a))}\n"

tests = [test([3, 1, 2]), test([2, 2, 5, 1, 4])]
tests.append(test([100000]))
tests.append(test([4, 4, 4, 4]))                         # valeurs toutes égales
tests.append(test(list(range(1, 13))))
tests.append(test(list(range(12, 0, -1))))
tests.append(test([random.randint(1, 3) for _ in range(40)]))
tests.append(test([random.randint(1, 100000) for _ in range(3000)]))
# grands tests : parcourir toutes les portions serait trop lent
tests.append(test([random.randint(1, 100000) for _ in range(20000)]))
tests.append(test([random.randint(1, 5) for _ in range(20000)]))
tests.append(test([100000] * 20000))
print(json.dumps(tests))
