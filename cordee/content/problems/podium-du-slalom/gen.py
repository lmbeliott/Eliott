import json, random
random.seed(2026)

PRENOMS = """Ines Yanis Mia Theo Awa Lucas Sofia Malik Chloe Nathan Lina Hugo Emma Jules Lea Adam
Zoe Noah Jade Louis Rose Gabriel Alice Ethan Nina Sacha Lou Rayan Manon Tom Eva Liam Camille Enzo
Sarah Ali Clara Mohamed Anna Paul Ambre Victor Julia Arthur Louise Samuel Iris Elias Mila Noe
Romane Axel Salome Timeo Margaux Aaron Ines Kenza Maxime Lena Oscar Celia Bastien Yasmine Marius
Agathe Mathis Elsa Leon Capucine Nolan Maelys Ilyes Lisa Robin Anais Antoine Zelie Basile Maya
Kylian Alix Martin Charlotte Simon Victoire Amir Lucie Gaspard Juliette Esteban Pauline Lenny
Faustine Mehdi Apolline Valentin Ninon Raphael Oceane Hamza Diane Joseph Leonie Augustin""".split()
PRENOMS = list(dict.fromkeys(PRENOMS))  # sans doublon

def test(coureurs):
    return f"{len(coureurs)}\n" + "".join(f"{p} {t}\n" for p, t in coureurs)

def hasard(n, mini, maxi):
    prenoms = random.sample(PRENOMS, n)
    temps = random.sample(range(mini, maxi + 1), n)
    return test(list(zip(prenoms, temps)))

tests = [
    test([("Ines", 5412), ("Yanis", 4987), ("Mia", 5120), ("Theo", 6003), ("Awa", 4999)]),
    test([("Lucas", 950), ("Sofia", 1000), ("Malik", 10000)]),
]
# Cas limites : exactement trois coureurs, déjà dans l'ordre ou à l'envers,
# temps très proches, et le meilleur temps tout à la fin.
tests.append(test([("Chloe", 3), ("Nathan", 2), ("Lina", 1)]))
tests.append(test([("Hugo", 1), ("Emma", 2), ("Jules", 3), ("Lea", 4)]))
tests.append(test([("Adam", 4501), ("Zoe", 4500), ("Noah", 4502), ("Jade", 4499), ("Louis", 4498)]))
tests.append(test([("Rose", 99999), ("Gabriel", 100000), ("Alice", 8), ("Ethan", 10), ("Nina", 9)]))
tests.append(test([("Sacha", 200), ("Lou", 30), ("Rayan", 1000), ("Manon", 4), ("Tom", 50000)]))
# Cas aléatoires, jusqu'à 100 coureurs.
for (n, mini, maxi) in [(8, 4000, 7000), (25, 3000, 9000), (60, 1, 100000), (100, 4500, 4700), (100, 1, 100000)]:
    tests.append(hasard(n, mini, maxi))
print(json.dumps(tests))
