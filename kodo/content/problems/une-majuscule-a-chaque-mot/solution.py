n = int(input())
resultat = []
for m in input().split():
    # première lettre en majuscule, le reste en minuscules
    resultat.append(m[0].upper() + m[1:].lower())
print(" ".join(resultat))
