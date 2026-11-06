lettres = input().strip()
n = len(lettres)

# compte[c] = nombre de lettres c encore disponibles
compte = {}
for c in lettres:
    compte[c] = compte.get(c, 0) + 1
differentes = sorted(compte)    # les lettres distinctes, dans l'ordre alphabétique

mots = []
mot = []

def explorer():
    if len(mot) == n:
        mots.append("".join(mot))
        return
    # chaque lettre distincte est essayée une seule fois à cette position :
    # deux lettres identiques donneraient exactement les mêmes mots
    for c in differentes:
        if compte[c] > 0:
            compte[c] -= 1
            mot.append(c)
            explorer()
            mot.pop()
            compte[c] += 1

explorer()
print(len(mots))
print("\n".join(mots))
