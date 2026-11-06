import json, random
random.seed(2026)

VRAIS = ("chien niche chine ancre crane ecran nacre rance arme mare rame amer piolet pilote "
         "lac cal neige genie aigle agile lion loin loupe poule store torse sorte oser rose "
         "route outre lacet eclat trace carte sapin pains imaginer migraine parisien aspirine "
         "ironique onirique tomme motte marmotte refuge glacier chamois cime sommet luge").split()

def test(mots):
    return f"{len(mots)}\n" + "".join(m + "\n" for m in mots)

def melange(s):
    l = list(s)
    random.shuffle(l)
    return "".join(l)

def hasard(n, nb_bases, longueur, alphabet):
    # Des mots obtenus en mélangeant quelques mots de base, et des « faux cousins »
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
    test(["chien", "lac", "niche", "piolet", "cal", "pilote", "neige"]),
    test(["rame", "tomme", "mare", "motte", "arme"]),
]
# Cas limites : un seul mot, aucun cousin, tous cousins, mots d'une lettre.
tests.append(test(["marmotte"]))
tests.append(test(["sommet", "glacier", "refuge", "luge", "cime"]))
tests.append(test(["ecran", "rance", "nacre", "crane", "ancre", "caner", "carne"]))
tests.append(test(["b", "a", "ab", "ba", "aab", "aba", "abb", "c"]))
w = list(VRAIS)
random.shuffle(w)
tests.append(test(w))
# Toutes les permutations distinctes d'un mot de 6 lettres : 720 mots, une seule famille.
from itertools import permutations
perms = sorted(set("".join(p) for p in permutations("valcor")))
random.shuffle(perms)
tests.append(test(perms))
# Cas aléatoires.
for (n, nb, lg, alphabet) in [(30, 6, 5, "abcde"), (200, 40, 8, "aeilnorst"), (1000, 120, 12, "abcdefghij"),
                              (1000, 400, 20, "abcdefghijklmnopqrstuvwxyz"), (1000, 30, 6, "abc"),
                              (600, 600, 7, "aeiourstl")]:
    tests.append(hasard(n, nb, lg, alphabet))
print(json.dumps(tests))
