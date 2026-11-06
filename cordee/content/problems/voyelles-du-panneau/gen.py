import json, random
random.seed(2026)

tests = ["valcorde\n", "lynx\n"]
# Cas limites : une seule lettre, que des voyelles, que des consonnes.
tests += ["a\n", "z\n", "aeiouy\n", "bcdfghjklmnpqrstvwxz\n", "yyyyyyyyyy\n"]
# Quelques mots de la vallée.
tests += ["telepherique\n", "marmotte\n", "bouquetin\n"]
# Mots aléatoires, jusqu'à 100 lettres.
for n in [15, 60, 100, 100]:
    tests.append("".join(random.choice("abcdefghijklmnopqrstuvwxyz") for _ in range(n)) + "\n")
print(json.dumps(tests))
