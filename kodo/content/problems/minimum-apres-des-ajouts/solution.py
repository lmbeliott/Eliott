import sys

INFINI = 1 << 62


def main():
    donnees = sys.stdin.buffer.read().split()
    n, q = int(donnees[0]), int(donnees[1])
    taille = 1
    while taille < n:
        taille *= 2
    # Nœud k : fils 2k et 2k + 1 ; les feuilles sont aux indices taille à 2 × taille - 1.
    # mini[k] et nb[k] : minimum de l'intervalle du nœud et nombre de cases qui l'atteignent,
    # ajouts compris. ajout[k] : valeur ajoutée à tout l'intervalle, pas encore transmise aux fils.
    mini = [0] * (2 * taille)
    nb = [0] * (2 * taille)
    ajout = [0] * (2 * taille)
    for i in range(taille):
        nb[taille + i] = 1
        if i >= n:
            mini[taille + i] = INFINI  # cases en trop : jamais minimales
    for k in range(taille - 1, 0, -1):
        g, d = 2 * k, 2 * k + 1
        if mini[g] < mini[d]:
            mini[k], nb[k] = mini[g], nb[g]
        elif mini[d] < mini[g]:
            mini[k], nb[k] = mini[d], nb[d]
        else:
            mini[k], nb[k] = mini[g], nb[g] + nb[d]

    def modifie(k, debut, fin, l, r, v):
        # Ajoute v aux cases de [l, r] ∩ [debut, fin], intervalle du nœud k.
        if r < debut or fin < l:
            return
        if l <= debut and fin <= r:
            mini[k] += v  # tout le nœud est couvert : on s'arrête là
            ajout[k] += v
            return
        milieu = (debut + fin) // 2
        modifie(2 * k, debut, milieu, l, r, v)
        modifie(2 * k + 1, milieu + 1, fin, l, r, v)
        g, d = 2 * k, 2 * k + 1
        if mini[g] < mini[d]:
            mini[k], nb[k] = mini[g] + ajout[k], nb[g]
        elif mini[d] < mini[g]:
            mini[k], nb[k] = mini[d] + ajout[k], nb[d]
        else:
            mini[k], nb[k] = mini[g] + ajout[k], nb[g] + nb[d]

    def interroge(k, debut, fin, l, r):
        # (minimum, nombre) sur [l, r] ∩ [debut, fin], sans les ajouts des ancêtres de k.
        if r < debut or fin < l:
            return INFINI, 0
        if l <= debut and fin <= r:
            return mini[k], nb[k]
        milieu = (debut + fin) // 2
        m1, c1 = interroge(2 * k, debut, milieu, l, r)
        m2, c2 = interroge(2 * k + 1, milieu + 1, fin, l, r)
        if m1 < m2:
            return m1 + ajout[k], c1
        if m2 < m1:
            return m2 + ajout[k], c2
        return m1 + ajout[k], c1 + c2

    sortie = []
    pos = 2
    for _ in range(q):
        if donnees[pos] == b'+':
            l, r, v = int(donnees[pos + 1]), int(donnees[pos + 2]), int(donnees[pos + 3])
            pos += 4
            modifie(1, 1, taille, l, r, v)
        else:
            l, r = int(donnees[pos + 1]), int(donnees[pos + 2])
            pos += 3
            m, c = interroge(1, 1, taille, l, r)
            sortie.append(f"{m} {c}")
    print("\n".join(sortie))


main()
