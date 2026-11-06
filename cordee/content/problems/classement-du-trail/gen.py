import json, random
random.seed(2026)

def test(temps, questions):
    return (f"{len(temps)} {len(questions)}\n" + " ".join(map(str, temps)) + "\n"
            + " ".join(map(str, questions)) + "\n")

def course(n, lo, hi):
    return [random.randint(lo, hi) for _ in range(n)]

def questions(temps, q, lo, hi):
    tri = sorted(temps)
    res = [x for x in (tri[0], tri[-1], tri[0] - 1, tri[-1] + 1, lo, hi) if 1 <= x <= 50000]
    while len(res) < q:
        if random.random() < 0.5:
            res.append(random.choice(temps))          # un temps déjà dans le classement
        else:
            res.append(random.randint(lo, hi))
    random.shuffle(res)
    return res[:q]

tests = [
    test([7300, 6540, 8100, 6540, 9020, 7100], [7000, 6540, 9500, 7300]),
    test([3600, 3600, 3600], [3600, 3601, 100]),
    test([5000], [5000]),
    test([5000], [1, 50000]),
    test([42] * 10, [41, 42, 43]),
    test(list(range(1, 21)), [1, 20, 10, 21]),
]
t = course(50, 3000, 4000)
tests.append(test(t, questions(t, 30, 2900, 4100)))
t = course(3000, 5000, 15000)
tests.append(test(t, questions(t, 3000, 4000, 16000)))
# deux tests de taille maximale
t = course(12000, 10000, 40000)
tests.append(test(t, questions(t, 12000, 1, 50000)))
t = course(12000, 20000, 22000)      # beaucoup d'ex aequo
tests.append(test(t, questions(t, 12000, 19000, 23000)))
# classement donné dans le désordre inverse
t = sorted(course(4000, 1, 50000), reverse=True)
tests.append(test(t, questions(t, 4000, 1, 50000)))
print(json.dumps(tests))
