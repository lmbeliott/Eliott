import json, random
random.seed(2026)

def test(lignes):
    return f"{len(lignes)} {len(lignes[0])}\n" + "\n".join(lignes) + "\n"

def vide(r, c):
    return ["." * c for _ in range(r)]

def avec_blocs(r, c, nb):
    # nb cases bloquées au hasard, puis d'autres si besoin pour que le nombre
    # de cases libres soit un multiple de 3
    g = [["."] * c for _ in range(r)]
    cases = [(i, j) for i in range(r) for j in range(c)]
    random.shuffle(cases)
    bloquees = nb
    while (r * c - bloquees) % 3:
        bloquees += 1
    for i, j in cases[:bloquees]:
        g[i][j] = "#"
    return ["".join(l) for l in g]

tests = [
    test(vide(2, 3)),
    test([".....", ".#...", "...#.", "....."]),
    test(["..."]),                                  # une seule ligne : impossible
    test(["#.", ".."]),                             # un seul trimino
    test(["#", "."]),                               # une seule case libre
    test(vide(3, 3)),                               # 9 cases, mais aucun pavage
    test(vide(4, 4)),                               # 16 cases : pas un multiple de 3
    test(["#...", "....", "....", "...."]),         # un seul pavage
    test(["##.##", "#...#", ".....", "#...#", "##.##"]),
    test(vide(3, 8)),
    test(vide(6, 6)),
    test(avec_blocs(5, 6, 3)),
    test(avec_blocs(7, 6, 2)),
    test(avec_blocs(6, 8, 6)),
    test(['.......#', '........', '..##....', '........', '#.......']),
    test(['......', '......', '......', '......', '......', '...#.#', '.....#']),
    # tailles maximales : poser les triminos dans n'importe quel ordre est hors de question
    test(vide(6, 8)),
    test(vide(8, 6)),
    test(avec_blocs(8, 6, 3)),
    test(['#.......', '........', '........', '.......#', '........', '.......#']),
    test(['....##..', '#.......', '........', '........', '........', '#....#.#']),
    test(['#..#..', '......', '......', '......', '......', '#.....', '...##.', '#.....']),
]
print(json.dumps(tests))
