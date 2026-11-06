import json, random
random.seed(2026)

tests = ["10\n", "35\n"]
# Les âges aux frontières des tranches.
limites = [0, 3, 4, 11, 12, 17, 18, 64, 65, 110]
tests += [f"{a}\n" for a in limites]
# Quelques âges au hasard, différents des précédents.
autres = [a for a in range(111) if a not in limites and a not in (10, 35)]
for a in random.sample(autres, 4):
    tests.append(f"{a}\n")
print(json.dumps(tests))
