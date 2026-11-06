import json, random
random.seed(2026)

MOTS = ("rendez vous demain matin devant la gare le train part a huit heures "
        "apporte le livre et les cles la reunion est annulee rappelle moi ce soir "
        "le colis arrive lundi prochain ne pas ouvrir avant jeudi le code change "
        "chaque semaine garde ce message secret la porte du fond reste fermee "
        "le zebre du zoo dort au zenith").split()

def coder(texte, k):
    return "".join(c if c == " " else chr(ord("a") + (ord(c) - ord("a") + k) % 26) for c in texte)

def test(texte, k):
    return f"{k}\n{coder(texte, k)}\n"

tests = [
    test("rendez vous devant la gare", 3),
    test("le code est secret", 2),
]
# Cas limites : décalage nul, décalage maximal, une seule lettre, tout l'alphabet.
tests.append(test("prends le livre", 0))
tests.append(test("le zebre du zoo dort au zenith", 25))
tests.append(test("a", 1))
tests.append(test("z", 13))
tests.append(test("abcdefghijklmnopqrstuvwxyz", 7))
tests.append(test("xyz abc", 24))
# Messages aléatoires faits de mots courants, jusqu'à 200 caractères.
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
