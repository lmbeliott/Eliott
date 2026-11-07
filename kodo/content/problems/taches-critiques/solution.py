import sys


def main():
    donnees = sys.stdin.buffer.read().split()
    n, m = int(donnees[0]), int(donnees[1])
    duree = [0] + [int(x) for x in donnees[2:2 + n]]
    suivants = [[] for _ in range(n + 1)]
    entrants = [0] * (n + 1)  # nombre de contraintes « avant moi » pas encore traitées
    pos = 2 + n
    for _ in range(m):
        a, b = int(donnees[pos]), int(donnees[pos + 1])
        pos += 2
        suivants[a].append(b)
        entrants[b] += 1

    # Ordre topologique (algorithme de Kahn) : on retire les tâches sans prérequis restant.
    ordre = [v for v in range(1, n + 1) if entrants[v] == 0]
    i = 0
    while i < len(ordre):
        u = ordre[i]
        i += 1
        for v in suivants[u]:
            entrants[v] -= 1
            if entrants[v] == 0:
                ordre.append(v)
    if len(ordre) < n:
        print(-1)  # certaines tâches restent bloquées : il y a un cycle
        return

    # debut[v] = date de début au plus tôt de v.
    debut = [0] * (n + 1)
    for u in ordre:
        fin = debut[u] + duree[u]
        for v in suivants[u]:
            if fin > debut[v]:
                debut[v] = fin
    total = max(debut[v] + duree[v] for v in range(1, n + 1))

    # reste[v] = durée de la plus longue chaîne qui commence par v (v compris).
    reste = [0] * (n + 1)
    for u in reversed(ordre):
        meilleur = 0
        for v in suivants[u]:
            if reste[v] > meilleur:
                meilleur = reste[v]
        reste[u] = duree[u] + meilleur

    # v est critique si une plus longue chaîne passe par v.
    critiques = sum(1 for v in range(1, n + 1) if debut[v] + reste[v] == total)
    print(total, critiques)


main()
