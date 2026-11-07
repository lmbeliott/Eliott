import json, random
random.seed(2026)

def test(mots):
    return f"{len(mots)}\n{' '.join(mots)}\n"

def mot_aleatoire(lettres, longueur):
    return "".join(random.choice(lettres) for _ in range(longueur))

tests = [test("le chat voit le chien et le chat".split()),
         test("rouge vert vert bleu rouge".split())]
tests.append(test(["seul"]))                                  # un seul mot
tests.append(test("a b c d e".split()))                        # tous à égalité : le premier
tests.append(test("x y y x".split()))                          # égalité, x apparaît d'abord
tests.append(test(["zz"] * 7))
tests.append(test("b a a b b a c c c c".split()))
for n, k in [(100, 10), (2000, 300), (20000, 5000), (20000, 50)]:
    vocabulaire = sorted({mot_aleatoire("abcdefgh", random.randint(1, 6)) for _ in range(k)})
    mots = [random.choice(vocabulaire) for _ in range(n)]
    tests.append(test(mots))
# grand test : égalité entre deux mots, le gagnant apparaît après d'autres mots
mots = [mot_aleatoire("abcdefghij", 8) for _ in range(15000)] + ["deux"] * 50 + ["un"] * 50
random.shuffle(mots)
tests.append(test(mots))
print(json.dumps(tests))
