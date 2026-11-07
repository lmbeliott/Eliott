import sys

MOINS_INFINI = -1 << 60


def main():
    donnees = list(map(int, sys.stdin.buffer.read().split()))
    n = donnees[0]
    w = [0] + donnees[1:n + 1]
    parent = [0, 0] + donnees[n + 1:2 * n]

    # Pour chaque sommet v (sous-arbre de v) :
    #   pris[v]   = v est choisi
    #   enfant[v] = v n'est pas choisi, mais un de ses enfants l'est
    #   libre[v]  = ni v ni ses enfants ne sont choisis
    pris = w[:]
    somme_libre = [0] * (n + 1)   # somme des libre[c] sur les enfants c
    somme_max = [0] * (n + 1)     # somme des max(enfant[c], libre[c]) sur les enfants c
    gain = [MOINS_INFINI] * (n + 1)  # max de pris[c] - max(enfant[c], libre[c]) sur les enfants c
    enfant = [0] * (n + 1)
    libre = [0] * (n + 1)

    # parent[i] < i : en parcourant i de n à 1, les enfants sont traités avant leur parent
    for v in range(n, 0, -1):
        pris[v] = w[v] + somme_libre[v]
        libre[v] = somme_max[v]
        enfant[v] = somme_max[v] + gain[v] if gain[v] > MOINS_INFINI else MOINS_INFINI
        if v > 1:
            p = parent[v]
            m = max(enfant[v], libre[v])
            somme_libre[p] += libre[v]
            somme_max[p] += m
            if pris[v] - m > gain[p]:
                gain[p] = pris[v] - m

    print(max(pris[1], enfant[1], libre[1]))


main()
