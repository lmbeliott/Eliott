n = int(input())
resultats = []
for _ in range(n):
    dossard, temps = input().split()
    # On met le temps en premier : le tri se fera d'abord sur lui.
    resultats.append((int(temps), dossard))

resultats.sort()

for i in range(3):
    print(resultats[i][1])
