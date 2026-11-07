import sys


def main():
    donnees = sys.stdin.buffer.read().split()
    n, m = int(donnees[0]), int(donnees[1])
    parent = list(range(n + 1))
    taille = [1] * (n + 1)

    def trouver(x):
        racine = x
        while parent[racine] != racine:
            racine = parent[racine]
        while parent[x] != racine:  # compression des chemins
            parent[x], x = racine, parent[x]
        return racine

    composantes, plus_grande = n, 1
    sortie = []
    for i in range(m):
        a = trouver(int(donnees[2 + 2 * i]))
        b = trouver(int(donnees[3 + 2 * i]))
        if a != b:
            if taille[a] < taille[b]:
                a, b = b, a
            parent[b] = a  # la petite composante passe sous la grande
            taille[a] += taille[b]
            composantes -= 1
            plus_grande = max(plus_grande, taille[a])
        sortie.append(f"{composantes} {plus_grande}")
    print("\n".join(sortie))


main()
