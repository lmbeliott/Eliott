import sys
from collections import deque

MUR, LIBRE, SORTIE = 0, 1, 2
JAMAIS = 10 ** 9  # minute de contamination d'une case jamais atteinte


def main():
    donnees = sys.stdin.buffer.read().split()
    r, c = int(donnees[0]), int(donnees[1])
    grille = donnees[2:2 + r]

    # Grille entourée d'une bordure de murs ; la case (i, j) devient i * largeur + j.
    largeur = c + 2
    taille = (r + 2) * largeur
    nature = bytearray(taille)  # MUR par défaut
    conta = [JAMAIS] * taille
    file_conta = deque()
    depart = 0
    for i in range(r):
        ligne = grille[i]
        for j in range(c):
            ch = chr(ligne[j])
            k = (i + 1) * largeur + (j + 1)
            if ch == '#':
                continue
            nature[k] = SORTIE if ch == 'X' else LIBRE
            if ch == '*':
                conta[k] = 0
                file_conta.append(k)
            elif ch == '@':
                depart = k

    # 1) La contamination : parcours en largeur depuis toutes les sources, arrêté par murs et sorties.
    while file_conta:
        u = file_conta.popleft()
        d = conta[u] + 1
        for v in (u - 1, u + 1, u - largeur, u + largeur):
            if nature[v] == LIBRE and conta[v] == JAMAIS:
                conta[v] = d
                file_conta.append(v)

    # 2) Le pion : parcours en largeur, en n'entrant que dans les cases encore saines.
    minute = [-1] * taille
    minute[depart] = 0
    file = deque([depart])
    while file:
        u = file.popleft()
        t = minute[u] + 1
        for v in (u - 1, u + 1, u - largeur, u + largeur):
            if nature[v] == MUR or minute[v] != -1:
                continue
            if nature[v] == SORTIE:
                print(t)
                return
            if t < conta[v]:
                minute[v] = t
                file.append(v)

    print(-1)


main()
