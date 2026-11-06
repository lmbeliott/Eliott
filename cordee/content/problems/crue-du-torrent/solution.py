import sys
from collections import deque

ROCHER, LIBRE, REFUGE = 0, 1, 2
JAMAIS = 10 ** 9  # minute d'inondation d'une case que l'eau n'atteint jamais


def main():
    donnees = sys.stdin.buffer.read().split()
    r, c = int(donnees[0]), int(donnees[1])
    carte = donnees[2:2 + r]

    # Carte entourée d'une bordure de rochers ; la case (i, j) devient i * largeur + j.
    largeur = c + 2
    taille = (r + 2) * largeur
    nature = bytearray(taille)  # ROCHER par défaut
    eau = [JAMAIS] * taille
    file_eau = deque()
    theo = 0
    for i in range(r):
        ligne = carte[i]
        for j in range(c):
            ch = chr(ligne[j])
            k = (i + 1) * largeur + (j + 1)
            if ch == '#':
                continue
            nature[k] = REFUGE if ch == 'R' else LIBRE
            if ch == 'E':
                eau[k] = 0
                file_eau.append(k)
            elif ch == 'T':
                theo = k

    # 1) L'eau : parcours en largeur depuis toutes les sources, arrêté par rochers et refuges.
    while file_eau:
        u = file_eau.popleft()
        d = eau[u] + 1
        for v in (u - 1, u + 1, u - largeur, u + largeur):
            if nature[v] == LIBRE and eau[v] == JAMAIS:
                eau[v] = d
                file_eau.append(v)

    # 2) Théo : parcours en largeur, en n'entrant que dans les cases encore sèches.
    minute = [-1] * taille
    minute[theo] = 0
    file = deque([theo])
    while file:
        u = file.popleft()
        t = minute[u] + 1
        for v in (u - 1, u + 1, u - largeur, u + largeur):
            if nature[v] == ROCHER or minute[v] != -1:
                continue
            if nature[v] == REFUGE:
                print(t)
                return
            if t < eau[v]:
                minute[v] = t
                file.append(v)

    print(-1)


main()
