import json, random
random.seed(2026)

LETTRES = "abcdefghijklmnopqrstuvwxyz"

def melange(s):
    l = list(s)
    random.shuffle(l)
    return "".join(l)

def test(boite, mot):
    return f"{boite}\n{mot}\n"

def autour(mot, k, extra, alphabet=LETTRES):
    # Une boîte avec k fois le mot, une lettre du mot en moins parfois, et des lettres en plus.
    boite = mot * k + "".join(random.choice(alphabet) for _ in range(extra))
    if k > 0 and random.random() < 0.5:
        i = boite.index(random.choice(mot))
        boite = boite[:i] + boite[i + 1:]
    return melange(boite)

tests = [
    test("mpoemazmeopmempo", "pomme"),
    test("chocolatnoir", "colle"),
]
# Cas limites : boîte d'une lettre, mot plus long que la boîte, mot d'une lettre,
# toutes les lettres identiques.
tests.append(test("a", "a"))
tests.append(test("a", "b"))
tests.append(test("abc", "abcd"))
tests.append(test("z" * 1000, "z"))
tests.append(test("z" * 1000, "zzz"))
tests.append(test("a" * 999 + "b", "ab"))
tests.append(test(melange("papillon" * 7 + "papillo"), "papillon"))
tests.append(test(melange(LETTRES * 38), LETTRES[:20]))
# Cas aléatoires autour d'un mot courant.
for (mot, k, extra) in [("table", 3, 20), ("ordinateur", 12, 200), ("bibliotheque", 40, 500),
                        ("fenetre", 0, 300), ("crayon", 50, 600), ("jardin", 100, 400)]:
    tests.append(test(autour(mot, k, extra)[:1000], mot))
tests.append(test("".join(random.choice("aeiou") for _ in range(1000)), "aiea"))
print(json.dumps(tests))
