n = int(input())
valeurs = input().split()
vues = set()
reponse = "AUCUNE"
for i in range(n):
    v = int(valeurs[i])
    if v in vues:
        reponse = str(v) + " " + str(i + 1)   # position comptée à partir de 1
        break
    vues.add(v)
print(reponse)
