import json, random
from datetime import date, timedelta
random.seed(2026)

DEBUT = date(1900, 1, 1)
FIN = date(2100, 12, 31)

def test(dates):
    return f"{len(dates)}\n" + "".join(d.strftime("%d/%m/") + f"{d.year:04d}\n" for d in dates)

def hasard(n, d1=DEBUT, d2=FIN):
    etendue = (d2 - d1).days
    return test(sorted(d1 + timedelta(days=random.randint(0, etendue)) for _ in range(n)))

D = date
tests = [
    test([D(2024, 6, 28), D(2024, 7, 15), D(2024, 9, 1)]),
    test([D(1999, 12, 20), D(1999, 12, 20), D(2000, 3, 1)]),
]
# Années bissextiles et fins de mois : 1900 et 2100 ne le sont pas, 2000 l'est.
tests.append(test([D(1900, 2, 28), D(1900, 3, 1)]))
tests.append(test([D(2000, 2, 28), D(2000, 3, 1)]))
tests.append(test([D(2100, 2, 28), D(2100, 3, 1)]))
tests.append(test([D(2023, 2, 28), D(2023, 3, 1), D(2024, 2, 28), D(2024, 3, 1)]))
tests.append(test([D(1999, 12, 31), D(2000, 1, 1)]))
# Toutes les dates identiques : la réponse est 0.
tests.append(test([D(2026, 8, 15)] * 5))
# Les deux dates extrêmes.
tests.append(test([DEBUT, FIN]))
tests.append(test([DEBUT, D(1900, 1, 2), FIN]))
# Le plus long écart est au début, au milieu, ou à la fin.
tests.append(test([D(1950, 7, 1), D(1951, 7, 1), D(1951, 7, 20), D(1951, 8, 1)]))
tests.append(test([D(2010, 1, 31), D(2010, 2, 1), D(2010, 3, 31), D(2010, 4, 1)]))
# Cas aléatoires : un registre sur quelques mois, sur quelques années, sur deux siècles.
tests.append(hasard(30, D(2025, 6, 1), D(2025, 9, 30)))
tests.append(hasard(100, D(1995, 1, 1), D(2005, 12, 31)))
tests.append(hasard(100))
tests.append(hasard(2))
tests.append(hasard(57, D(2090, 1, 1), FIN))
print(json.dumps(tests))
