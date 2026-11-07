import json, random
random.seed(2026)

def test(n, b):
    return f"{n} {b}\n"

tests = [test(10, 2), test(1000, 3)]
tests.append(test(1, 2))
tests.append(test(9, 9))
tests.append(test(100, 9))
tests.append(test(585, 2))                     # 585 s'écrit 1001001001 en base 2
tests.append(test(99999, 7))
tests.append(test(random.randint(10**5, 10**6), 4))
tests.append(test(random.randint(10**6, 10**7), 5))
tests.append(test(10**8, 6))
# grands tests : essayer chaque nombre jusqu'à 10⁹ serait trop lent
tests.append(test(10**9, 2))
tests.append(test(10**9, 3))
tests.append(test(999999999, 8))
tests.append(test(876543210, 9))
print(json.dumps(tests))
