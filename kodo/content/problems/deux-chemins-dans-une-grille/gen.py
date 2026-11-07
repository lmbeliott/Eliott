import json, random
random.seed(2026)

R = C = 100

def test(lignes):
    return f"{len(lignes)} {len(lignes[0])}\n" + "\n".join(lignes) + "\n"

def aleatoire(r, c, p_mur, chiffres="0123456789", creuser=True):
    g = [["#" if random.random() < p_mur else random.choice(chiffres) for _ in range(c)] for _ in range(r)]
    if creuser:
        # on dégage un chemin au hasard pour qu'il en existe au moins un
        i = j = 0
        while True:
            if g[i][j] == "#":
                g[i][j] = random.choice(chiffres)
            if i == r - 1 and j == c - 1:
                break
            if j == c - 1 or (i < r - 1 and random.random() < 0.5):
                i += 1
            else:
                j += 1
    return ["".join(l) for l in g]

def deux_bandes(r, c):
    # de gros chiffres le long de deux bandes éloignées, presque rien ailleurs :
    # un seul chemin ne peut pas tout prendre, et le meilleur chemin seul est un mauvais premier choix
    g = [["0" if random.random() < 0.8 else "1" for _ in range(c)] for _ in range(r)]
    for i in range(r):
        for j in range(c):
            if abs(i - j - c // 4) <= 1 or abs(j - i - c // 4) <= 1:
                g[i][j] = random.choice("6789")
            if abs(i - j) <= 1 and random.random() < 0.5:
                g[i][j] = "9"
    return ["".join(l) for l in g]

tests = [
    test(["123", "4#5"]),
    test(["002", "628", "054"]),
    test(["1#", "#1"]),
    test(["7"]),
    test(["#"]),
    test(["5" * 10]),
    test(["3"] * 10),
    test(["9#9", "9#9", "999"]),
    test(aleatoire(6, 7, 0.15)),
    test(aleatoire(10, 4, 0.2)),
]
# tailles maximales
tests.append(test(aleatoire(R, C, 0.0)))
tests.append(test(aleatoire(R, C, 0.18)))
tests.append(test(deux_bandes(R, C)))
tests.append(test(aleatoire(R, C, 0.1, "0000000009")))
tests.append(test(["9" * C] * R))
g = aleatoire(R, C, 0.0)
g[R // 2] = "#" * (C - 1) + g[R // 2][-1]
g[R // 2 + 1] = g[R // 2 + 1][0] + "#" * (C - 1)
tests.append(test(g))                      # aucun chemin
tests.append(test(aleatoire(R, 15, 0.3)))
tests.append(test(aleatoire(R, C, 0.3, creuser=False)))   # sans doute aucun chemin
print(json.dumps(tests))
