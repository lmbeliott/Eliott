import json, random
random.seed(3205)

def test(a, b):
    return f"{len(a)}\n{' '.join(map(str, a))}\n{' '.join(map(str, b))}\n"

def melange(n):
    c = list(range(1, 2 * n + 1))
    random.shuffle(c)
    return c[:n], c[n:]

tests = [test([5, 2, 8], [3, 7, 1]), test([1, 4], [2, 3])]
tests.append(test([2], [1]))                          # un seul tour
tests.append(test([1], [2]))
tests.append(test([6, 5, 4], [3, 2, 1]))              # le premier gagne tous les tours
tests.append(test(*melange(5)))
tests.append(test(*melange(30)))
tests.append(test(*melange(200)))
tests.append(test(*melange(300)))
# grands tests : 1 000 000 de tours avec de grands paquets
tests.append(test(*melange(10000)))
fort = list(range(10001, 20001)); faible = list(range(1, 10001))
random.shuffle(fort); random.shuffle(faible)
tests.append(test(faible, fort))                      # le second gagne en 10 000 tours
a, b = melange(10000)
tests.append(test(b, a))
print(json.dumps(tests))
