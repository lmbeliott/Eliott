import json, random
random.seed(3303)

def test(k, grille):
    return f"{len(grille)} {len(grille[0])} {k}\n" + "".join(l + "\n" for l in grille)

def aleatoire(n, m, k, chiffres="0123456789"):
    return test(k, ["".join(random.choice(chiffres) for _ in range(m)) for _ in range(n)])

tests = [test(2, ["1203", "4521", "0099", "1100"]), test(1, ["000", "070", "007"])]
tests.append(test(1, ["5"]))
tests.append(test(3, ["111", "111", "111"]))                 # le carré est tout le champ
tests.append(test(2, ["0000", "0000"]))                      # égalité partout : coin (1, 1)
tests.append(test(2, ["1001", "0000", "1001"]))              # plusieurs carrés optimaux
tests.append(aleatoire(7, 12, 3))
tests.append(aleatoire(40, 25, 10, "0019"))
tests.append(aleatoire(150, 200, 60))
# grands tests : additionner chaque carré serait trop lent
tests.append(aleatoire(300, 300, 150))
tests.append(aleatoire(300, 300, 120, "01"))
print(json.dumps(tests))
