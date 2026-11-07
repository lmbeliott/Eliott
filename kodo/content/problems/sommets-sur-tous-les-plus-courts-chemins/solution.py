import sys
from collections import deque


def distances(depart, voisins, n):
    # parcours en largeur : distance (en nombre d'arêtes) depuis « depart », -1 si inaccessible
    dist = [-1] * (n + 1)
    dist[depart] = 0
    file = deque([depart])
    while file:
        u = file.popleft()
        for v in voisins[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + 1
                file.append(v)
    return dist


def main():
    donnees = sys.stdin.buffer.read().split()
    n, m, s, t = int(donnees[0]), int(donnees[1]), int(donnees[2]), int(donnees[3])
    voisins = [[] for _ in range(n + 1)]
    for i in range(m):
        a = int(donnees[4 + 2 * i])
        b = int(donnees[5 + 2 * i])
        voisins[a].append(b)
        voisins[b].append(a)

    depuis_s = distances(s, voisins, n)
    depuis_t = distances(t, voisins, n)
    d = depuis_s[t]
    if d == -1:
        print(-1)
        return

    # Un sommet v est sur un plus court chemin si depuis_s[v] + depuis_t[v] == d.
    # Chaque plus court chemin passe par exactement un tel sommet à chaque distance k de s.
    sur_un_chemin = [v for v in range(1, n + 1)
                     if depuis_s[v] != -1 and depuis_t[v] != -1 and depuis_s[v] + depuis_t[v] == d]
    par_distance = [0] * (d + 1)
    for v in sur_un_chemin:
        par_distance[depuis_s[v]] += 1
    # v est sur tous les plus courts chemins s'il est le seul à sa distance
    obligatoires = [v for v in sur_un_chemin if par_distance[depuis_s[v]] == 1]

    print(len(obligatoires))
    print(" ".join(map(str, obligatoires)))


main()
