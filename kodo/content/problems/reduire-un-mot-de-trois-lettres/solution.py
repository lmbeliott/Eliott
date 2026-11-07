def reduire(mot):
    """Longueur minimale après réductions, suivie de la lettre restante si elle vaut 1."""
    nb = [0, 0, 0]
    for c in mot:
        nb[ord(c) - ord("a")] += 1
    # une seule lettre différente : aucune opération possible
    if (nb[0] == 0) + (nb[1] == 0) + (nb[2] == 0) == 2:
        if len(mot) == 1:
            return "1 " + mot
        return str(len(mot))
    p = [x % 2 for x in nb]
    if p[0] == p[1] == p[2]:
        return "2"
    # la lettre dont la parité diffère des deux autres est celle qui reste
    for k in range(3):
        if p[k] != p[(k + 1) % 3] and p[k] != p[(k + 2) % 3]:
            return "1 " + chr(ord("a") + k)


t = int(input())
reponses = []
for _ in range(t):
    reponses.append(reduire(input()))
print("\n".join(reponses))
