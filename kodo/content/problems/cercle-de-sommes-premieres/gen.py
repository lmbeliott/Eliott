import json, random
random.seed(2043)

def test(a):
    return f"{len(a)}\n{' '.join(map(str, a))}\n"

def melange(a):
    a = list(a)
    random.shuffle(a)
    return a

tests = []
tests.append(test([1, 2, 3, 4]))
tests.append(test([1, 2, 3, 4, 5, 6]))
tests.append(test([1, 2, 3]))
tests.append(test([2, 3, 5]))
tests.append(test(list(range(1, 13))))
tests.append(test(list(range(1, 15))))
tests.append(test(melange([1, 51, 5, 25, 35, 11, 55, 2, 18, 6, 8, 28, 12, 36])))
tests.append(test(melange(range(1, 13))))
tests.append(test(list(range(1, 12))))
tests.append(test(melange(range(1, 11))))
tests.append(test([3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25]))
# six impairs et six pairs choisis pour avoir beaucoup de sommes premières
tests.append(test(melange([1, 7, 13, 19, 37, 43, 4, 10, 16, 6, 30, 24])))
tests.append(test(melange([1, 3, 7, 9, 13, 15, 2, 4, 8, 10, 14, 16])))
for n in [8, 10, 12, 14, 14]:
    imp = random.sample(range(1, 40, 2), n // 2)
    pai = random.sample(range(2, 40, 2), n - n // 2)
    tests.append(test(melange(imp + pai)))
tests.append(test(random.sample(range(1, 1001), 14)))
print(json.dumps(tests))
