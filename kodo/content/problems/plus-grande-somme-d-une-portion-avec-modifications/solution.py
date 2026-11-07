import sys

MOINS_INFINI = -10 ** 15


def main():
    donnees = sys.stdin.buffer.read().split()
    n, q = int(donnees[0]), int(donnees[1])
    taille = 1
    while taille < n:
        taille *= 2

    # Pour chaque nœud de l'arbre de segments, quatre informations sur son intervalle :
    # somme totale, meilleur préfixe, meilleur suffixe, meilleure portion (non vides).
    # Les feuilles en trop sont neutres : somme 0, et rien d'autre de possible.
    somme = [0] * (2 * taille)
    pref = [MOINS_INFINI] * (2 * taille)
    suff = [MOINS_INFINI] * (2 * taille)
    best = [MOINS_INFINI] * (2 * taille)

    def recalcule(k):
        g, d = 2 * k, 2 * k + 1
        somme[k] = somme[g] + somme[d]
        pref[k] = max(pref[g], somme[g] + pref[d])
        suff[k] = max(suff[d], somme[d] + suff[g])
        best[k] = max(best[g], best[d], suff[g] + pref[d])

    for i in range(n):
        v = int(donnees[2 + i])
        k = taille + i
        somme[k] = pref[k] = suff[k] = best[k] = v
    for k in range(taille - 1, 0, -1):
        recalcule(k)

    sortie = []
    pos = 2 + n
    for _ in range(q):
        t, x, y = donnees[pos], int(donnees[pos + 1]), int(donnees[pos + 2])
        pos += 3
        if t == b"1":
            # Modification de la case x : on change la feuille puis on remonte.
            k = taille + x - 1
            somme[k] = pref[k] = suff[k] = best[k] = y
            k //= 2
            while k:
                recalcule(k)
                k //= 2
        else:
            # Question sur [x, y] : on combine les nœuds de gauche à droite.
            # (s1, p1, u1, b1) accumule la partie gauche, (s2, p2, u2, b2) la partie droite.
            s1, p1, u1, b1 = 0, MOINS_INFINI, MOINS_INFINI, MOINS_INFINI
            s2, p2, u2, b2 = 0, MOINS_INFINI, MOINS_INFINI, MOINS_INFINI
            l, r = taille + x - 1, taille + y
            while l < r:
                if l & 1:
                    # gauche = gauche + nœud l
                    b1 = max(b1, best[l], u1 + pref[l])
                    p1 = max(p1, s1 + pref[l])
                    u1 = max(suff[l], somme[l] + u1)
                    s1 += somme[l]
                    l += 1
                if r & 1:
                    r -= 1
                    # droite = nœud r + droite
                    b2 = max(best[r], b2, suff[r] + p2)
                    u2 = max(u2, s2 + suff[r])
                    p2 = max(pref[r], somme[r] + p2)
                    s2 += somme[r]
                l //= 2
                r //= 2
            sortie.append(max(b1, b2, u1 + p2))

    print("\n".join(map(str, sortie)))


main()
