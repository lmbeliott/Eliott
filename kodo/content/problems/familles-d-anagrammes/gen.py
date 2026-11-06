import json, random
random.seed(2026)

VRAIS = ("chien niche chine ancre crane ecran nacre rance arme mare rame amer aimer marie maire "
         "signe singe lac cal ecrit recit lion loin loupe poule store torse sorte oser rose "
         "route outre lacet eclat trace carte rien nier imaginer migraine parisien aspirine "
         "ironique onirique salle lasse sale table livre stylo cahier gomme").split()

def test(mots):
    return f"{len(mots)}\n" + "".join(m + "\n" for m in mots)

def melange(s):
    l = list(s)
    random.shuffle(l)
    return "".join(l)

def hasard(n, nb_bases, longueur, alphabet):
    # Des mots obtenus en mélangeant quelques mots de base, et des « fausses anagrammes »
    # qui ont les mêmes lettres en des quantités différentes.
    bases = ["".join(random.choice(alphabet) for _ in range(random.randint(1, longueur)))
             for _ in range(nb_bases)]
    mots = set()
    essais = 0
    while len(mots) < n and essais < 100 * n:
        essais += 1
        b = random.choice(bases)
        r = random.random()
        if r < 0.75:
            m = melange(b)
        else:
            l = list(b)
            if len(l) > 1 and random.random() < 0.5:
                l.pop(random.randrange(len(l)))
            else:
                l.append(random.choice(b))
            m = melange("".join(l))[:20]
        mots.add(m)
    mots = sorted(mots)  # un ensemble n'a pas d'ordre fixe : on trie avant de mélanger
    random.shuffle(mots)
    return test(mots)

tests = [
    test(["chien", "lac", "niche", "signe", "cal", "singe", "table"]),
    test(["rame", "salle", "mare", "lasse", "arme"]),
]
# Cas limites : un seul mot, aucune anagramme, toutes anagrammes, mots d'une lettre.
tests.append(test(["ordinateur"]))
tests.append(test(["livre", "stylo", "cahier", "gomme", "regle"]))
tests.append(test(["ecran", "rance", "nacre", "crane", "ancre", "caner", "carne"]))
tests.append(test(["b", "a", "ab", "ba", "aab", "aba", "abb", "c"]))
w = list(VRAIS)
random.shuffle(w)
tests.append(test(w))
# Toutes les permutations distinctes d'un mot de 6 lettres : 720 mots, une seule famille.
from itertools import permutations
perms = sorted(set("".join(p) for p in permutations("carton")))
random.shuffle(perms)
tests.append(test(perms))
# Cas aléatoires.
for (n, nb, lg, alphabet) in [(30, 6, 5, "abcde"), (200, 40, 8, "aeilnorst"), (1000, 120, 12, "abcdefghij"),
                              (1000, 400, 20, "abcdefghijklmnopqrstuvwxyz"), (1000, 30, 6, "abc"),
                              (600, 600, 7, "aeiourstl")]:
    tests.append(hasard(n, nb, lg, alphabet))
print(json.dumps(tests))
