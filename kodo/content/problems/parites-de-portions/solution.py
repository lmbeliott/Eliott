import sys


def main():
    donnees = sys.stdin.buffer.read().split()
    q = int(donnees[1])
    numero = {}  # numéro compact de chaque préfixe rencontré
    parent = []

    def sommet(x):
        # chaque préfixe x donne deux sommets : 2k (« P[x] vaut 0 ») et 2k + 1 (« P[x] vaut 1 »)
        if x not in numero:
            numero[x] = len(numero)
            parent.append(len(parent))
            parent.append(len(parent))
        return 2 * numero[x]

    def trouver(x):
        racine = x
        while parent[racine] != racine:
            racine = parent[racine]
        while parent[x] != racine:
            parent[x], x = racine, parent[x]
        return racine

    def unir(a, b):
        parent[trouver(a)] = trouver(b)

    k = 0
    for t in range(q):
        l, r, p = int(donnees[2 + 3 * t]), int(donnees[3 + 3 * t]), int(donnees[4 + 3 * t])
        # b[l] + ... + b[r] a la parité p  ⟺  P[r] et P[l - 1] diffèrent de p
        i, j = sommet(l - 1), sommet(r)
        if trouver(i) == trouver(j + 1 - p):  # on sait déjà que la parité est 1 - p
            break
        unir(i, j + p)
        unir(i + 1, j + 1 - p)
        k += 1
    print(k)


main()
