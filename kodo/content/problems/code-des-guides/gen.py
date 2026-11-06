import json, random
random.seed(2026)

MOTS = ("rendez vous au col de la croix demain matin rejoins moi au refuge du lac noir "
        "attention brouillard sur le glacier zone de crevasses prends la corde et le piolet "
        "les bouquetins sont au dessus du vallon neige fraiche cette nuit depart avant "
        "le lever du soleil retour par la crete nord cabane fermee pas de reseau ici "
        "yanis et mia montent avec les skis le zodiaque brille au zenith").split()

def coder(texte, k):
    return "".join(c if c == " " else chr(ord("a") + (ord(c) - ord("a") + k) % 26) for c in texte)

def test(texte, k):
    return f"{k}\n{coder(texte, k)}\n"

tests = [
    test("rendez vous au col", 3),
    test("zone de brouillard", 2),
]
# Cas limites : décalage nul, décalage maximal, une seule lettre, tout l'alphabet.
tests.append(test("prends la corde", 0))
tests.append(test("le zodiaque brille au zenith", 25))
tests.append(test("a", 1))
tests.append(test("z", 13))
tests.append(test("abcdefghijklmnopqrstuvwxyz", 7))
tests.append(test("xyz abc", 24))
# Messages aléatoires faits de mots de la vallée, jusqu'à 200 caractères.
for _ in range(5):
    mots = []
    while True:
        m = random.choice(MOTS)
        if len(" ".join(mots + [m])) > 200:
            break
        mots.append(m)
    tests.append(test(" ".join(mots), random.randint(1, 25)))
# Un long mot sans espace.
tests.append(test("".join(random.choice("abcdefghijklmnopqrstuvwxyz") for _ in range(200)), 19))
print(json.dumps(tests))
