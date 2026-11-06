import json, random
random.seed(2026)

def test(participants):
    return f"{len(participants)}\n" + "".join(f"{d} {t}\n" for d, t in participants)

def hasard(n, mini, maxi):
    dossards = random.sample(range(1, 1000), n)
    temps = random.sample(range(mini, maxi + 1), n)
    return test(list(zip(dossards, temps)))

tests = [
    test([(12, 5412), (7, 4987), (31, 5120), (4, 6003), (25, 4999)]),
    test([(3, 950), (1, 1000), (2, 10000)]),
]
# Cas limites : exactement trois participants, déjà dans l'ordre ou à l'envers,
# temps très proches, et le meilleur temps tout à la fin.
tests.append(test([(1, 3), (2, 2), (3, 1)]))
tests.append(test([(10, 1), (20, 2), (30, 3), (40, 4)]))
tests.append(test([(5, 4501), (6, 4500), (7, 4502), (8, 4499), (9, 4498)]))
tests.append(test([(100, 99999), (200, 100000), (300, 8), (400, 10), (500, 9)]))
tests.append(test([(999, 200), (11, 30), (1, 1000), (44, 4), (550, 50000)]))
# Cas aléatoires, jusqu'à 100 participants.
for (n, mini, maxi) in [(8, 4000, 7000), (25, 3000, 9000), (60, 1, 100000), (100, 4500, 4700), (100, 1, 100000)]:
    tests.append(hasard(n, mini, maxi))
print(json.dumps(tests))
