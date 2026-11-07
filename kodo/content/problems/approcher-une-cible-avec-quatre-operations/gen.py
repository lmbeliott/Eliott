import json, random
random.seed(2045)

def test(cible, nombres):
    return f"{len(nombres)} {cible}\n{' '.join(map(str, nombres))}\n"

tests = []
tests.append(test(24, [1, 3, 4, 6]))
tests.append(test(1000, [7, 3, 2]))
tests.append(test(5, [5]))
tests.append(test(1, [100]))
tests.append(test(10 ** 6, [100, 100, 100]))
tests.append(test(10 ** 6, [1, 1, 1, 1, 1, 1]))
tests.append(test(812, [75, 50, 2, 3, 8, 7]))
tests.append(test(999999, [97, 89, 83, 79, 73, 71]))
tests.append(test(1, [97, 89, 83, 79, 73, 71]))
tests.append(test(731, [25, 50, 75, 100, 3, 6]))
for _ in range(6):
    tests.append(test(random.randint(100, 10 ** 6), random.sample(range(1, 101), 6)))
tests.append(test(random.randint(100, 999), [random.choice([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 25, 50, 75, 100]) for _ in range(6)]))
tests.append(test(random.randint(1, 500), random.sample(range(1, 101), 5)))
print(json.dumps(tests))
