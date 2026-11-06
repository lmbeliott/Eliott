import json, random
random.seed(2026)

def test(carnet):
    return f"{len(carnet)}\n{carnet}\n"

def aleatoire(n, lettres):
    return "".join(random.choice(lettres) for _ in range(n))

tests = [
    test("orocaoorcca"),
    test("lllll"),
    test("v"),
    test("abcdefghijklmnopqrstuvwxyz"),       # tout le carnet
    test("abab"),                             # plusieurs fenêtres minimales : la première
    test("zzzazzzbzzzazzbzza"),
    test("cabbbbbbbbbbbbbbbbac"),
]
tests.append(test(aleatoire(30, "abcd")))
tests.append(test(aleatoire(2000, "abcdefghij")))
mot = aleatoire(20000, "abcdefghijklmnopqrstuvwxy")
tests.append(test(mot))
# taille maximale : deux constellations rares aux deux bouts du carnet,
# la fenêtre minimale couvre presque tout (pire cas pour la solution naïve)
milieu = aleatoire(99990, "abcdefghijklmnopqrstuvwx")
tests.append(test("y" + aleatoire(4, "abcd") + milieu + aleatoire(4, "abcd") + "z"))
tests.append(test(aleatoire(50000, "mnopq") + "s" + aleatoire(49999, "mnopqr")))
tests.append(test(aleatoire(100000, "abcdefghijklmnopqrstuvwxyz")))
print(json.dumps(tests))
