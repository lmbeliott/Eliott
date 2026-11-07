import json, random
random.seed(3101)

def test(notes):
    return f"{len(notes)}\n{' '.join(map(str, notes))}\n"

tests = [test([12, 5, 18, 12, 0, 20, 9]), test([10, 10, 3])]
tests.append(test([7]))                                  # une seule copie
tests.append(test([20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]))
tests.append(test([0] * 15))                             # toutes égales
tests.append(test([random.randint(0, 20) for _ in range(100)]))
tests.append(test([random.choice([0, 20]) for _ in range(1000)]))
tests.append(test([random.randint(8, 14) for _ in range(5000)]))
# grands tests : un tri par sélection ou par insertion serait trop lent
tests.append(test([random.randint(0, 20) for _ in range(50000)]))
tests.append(test(sorted((random.randint(0, 20) for _ in range(50000)), reverse=True)))
print(json.dumps(tests))
