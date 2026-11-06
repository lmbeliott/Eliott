import json, random
random.seed(2026)

tests = ["programme\n", "lynx\n"]
# Cas limites : une seule lettre, que des voyelles, que des consonnes.
tests += ["a\n", "z\n", "aeiouy\n", "bcdfghjklmnpqrstvwxz\n", "yyyyyyyyyy\n"]
# Quelques mots courants.
tests += ["bibliotheque\n", "rythme\n", "ordinateur\n"]
# Mots aléatoires, jusqu'à 100 lettres.
for n in [15, 60, 100, 100]:
    tests.append("".join(random.choice("abcdefghijklmnopqrstuvwxyz") for _ in range(n)) + "\n")
print(json.dumps(tests))
