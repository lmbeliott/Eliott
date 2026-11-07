import json, random
random.seed(2026)

def test(lignes):
    return f"{len(lignes)} {len(lignes[0])}\n" + "".join(l + "\n" for l in lignes)

def hasard(h, w, p):
    # Chaque case est marquée avec la probabilité p.
    return test(["".join("#" if random.random() < p else "." for _ in range(w)) for _ in range(h)])

tests = [
    test(["#.#", "###", "#.#"]),
    test(["##.##", "#.###", ".####", "##..#"]),
]
tests += [
    test(["#"]),                                # une seule case
    test(["####"]),                             # une seule ligne : aucun rectangle
    test(["#", "#", "#"]),                      # une seule colonne
    test(["##", "##"]),                         # le plus petit rectangle
    test(["....", "....", "...."]),             # aucune case marquée
    test(["#..#", "....", "#..#"]),             # seuls les coins comptent
    test(["#.#.#", ".#.#.", "#.#.#", ".#.#.", "#.#.#"]),  # damier
    hasard(6, 8, 0.6),
    hasard(50, 70, 0.3),
    test(["#" * 200] * 200),                    # tout est marqué : le plus de rectangles
    hasard(200, 200, 0.9),
    hasard(200, 200, 0.5),
    hasard(200, 150, 0.97),
    hasard(1, 200, 1.0),
    hasard(200, 2, 0.8),
    test(["#" * 200 if l % 2 == 0 else "." * 200 for l in range(200)]),  # lignes pleines et lignes vides
]
print(json.dumps(tests))
