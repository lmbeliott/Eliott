import json, random
random.seed(2026)

def test(k, a):
    return f"{len(a)} {k}\n{' '.join(map(str, a))}\n"

tests = [test(3, [1, 5, 2, 4, 3]), test(2, [7, 1, 8, 9, 1, 1, 8])]
tests.append(test(1, [42]))
tests.append(test(4, [5, 5, 5, 5]))
tests.append(test(5, [9, 1, 9, 1, 9]))
tests.append(test(1, [3, 100000, 2]))
tests.append(test(6, list(range(1, 11))))
tests.append(test(7, [random.randint(1, 20) for _ in range(40)]))
tests.append(test(20000, [random.randint(1, 100000) for _ in range(20000)]))
tests.append(test(9000, [random.randint(1, 100000) for _ in range(20000)]))
# beaucoup de petites valeurs et quelques grandes
tests.append(test(1000, [random.choice([random.randint(1, 1000), random.randint(90000, 100000)]) if random.random() < 0.5 else random.randint(1, 50) for _ in range(20000)]))
# une suite qui monte puis redescend
tests.append(test(2500, [min(i, 15000 - i) % 100000 + 1 for i in range(15000)]))
print(json.dumps(tests))
