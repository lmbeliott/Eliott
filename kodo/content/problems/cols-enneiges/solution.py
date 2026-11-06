import sys


def main():
    donnees = sys.stdin.buffer.read().split()
    n, m, q = int(donnees[0]), int(donnees[1]), int(donnees[2])
    valeurs = list(map(int, donnees[3:]))
    # Sentiers triés par altitude du col : (H, A, B).
    sentiers = sorted((valeurs[3 * i + 2], valeurs[3 * i], valeurs[3 * i + 1]) for i in range(m))
    questions = [(valeurs[3 * (m + j)], valeurs[3 * (m + j) + 1], valeurs[3 * (m + j) + 2]) for j in range(q)]

    # Union-find avec compression des chemins et union par taille.
    parent = list(range(n + 1))
    taille = [1] * (n + 1)

    def trouve(x):
        racine = x
        while parent[racine] != racine:
            racine = parent[racine]
        while parent[x] != racine:  # compression : tout le chemin pointe vers la racine
            suivant = parent[x]
            parent[x] = racine
            x = suivant
        return racine

    def unit(a, b):
        a, b = trouve(a), trouve(b)
        if a == b:
            return
        if taille[a] < taille[b]:
            a, b = b, a
        parent[b] = a  # le petit groupe rejoint le grand
        taille[a] += taille[b]

    reponses = [""] * q
    k = 0  # nombre de sentiers déjà ajoutés
    for j in sorted(range(q), key=lambda j: questions[j][2]):
        x, y, s = questions[j]
        while k < m and sentiers[k][0] <= s:
            unit(sentiers[k][1], sentiers[k][2])
            k += 1
        reponses[j] = "OUI" if trouve(x) == trouve(y) else "NON"

    print("\n".join(reponses))


main()
