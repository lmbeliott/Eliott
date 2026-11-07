import sys

donnees = sys.stdin.read().split()
n, m = int(donnees[0]), int(donnees[1])
voisins = [0] * n                     # voisins[v] : masque des voisins de v
for k in range(m):
    a = int(donnees[2 + 2 * k]) - 1
    b = int(donnees[3 + 2 * k]) - 1
    voisins[a] |= 1 << b
    voisins[b] |= 1 << a

def nb_bits(x):
    return bin(x).count("1")

meilleur = 0

def chercher(restants, taille):
    global meilleur
    # règle 1 : si les voisins restants de v sont deux à deux voisins, on peut prendre v
    change = True
    while change:
        change = False
        r = restants
        while r:
            v = (r & -r).bit_length() - 1
            r &= r - 1
            if not restants >> v & 1:
                continue
            ferme = (voisins[v] | 1 << v) & restants
            w = voisins[v] & restants
            simplicial = True
            while w:
                u = (w & -w).bit_length() - 1
                w &= w - 1
                if ferme & ~(voisins[u] | 1 << u):
                    simplicial = False
                    break
            if simplicial:
                restants &= ~ferme
                taille += 1
                change = True
    # règle 2 : même en prenant tous les sommets restants, on ne battrait pas le meilleur
    if taille + nb_bits(restants) <= meilleur:
        return
    if restants == 0:
        meilleur = taille
        return
    # branchement sur un sommet de degré maximal : on le prend, ou on l'écarte
    v_max, d_max = -1, -1
    r = restants
    while r:
        v = (r & -r).bit_length() - 1
        r &= r - 1
        d = nb_bits(voisins[v] & restants)
        if d > d_max:
            v_max, d_max = v, d
    chercher(restants & ~(voisins[v_max] | 1 << v_max), taille + 1)
    chercher(restants & ~(1 << v_max), taille)

chercher((1 << n) - 1, 0)
print(meilleur)
