import json, random
random.seed(3306)

def test(k, a):
    return f"{len(a)} {k}\n{' '.join(map(str, a))}\n"

tests = [test(3, [1, 2, 3]), test(5, [4, -2, 3, -10, 6, 1])]
tests.append(test(1, [7]))                                  # tout est divisible par 1
tests.append(test(10, [3]))
tests.append(test(4, [0, 0, 0]))                            # 6 portions de somme nulle
tests.append(test(7, [-7, -14, 5, -5, 2]))
tests.append(test(1000000000, [999, -999, 999, -999]))
tests.append(test(random.randint(2, 20), [random.randint(-999, 999) for _ in range(60)]))
tests.append(test(97, [random.randint(-999, 999) for _ in range(3000)]))
# grands tests : examiner chaque portion serait trop lent
tests.append(test(13, [random.randint(-999, 999) for _ in range(25000)]))
tests.append(test(1000000000, [random.choice([-1, 1]) * random.randint(0, 3) for _ in range(25000)]))
tests.append(test(5000, [random.randint(-999, 0) for _ in range(25000)]))
print(json.dumps(tests))
