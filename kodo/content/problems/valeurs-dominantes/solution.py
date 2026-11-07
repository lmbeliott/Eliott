n = int(input())
liste = list(map(int, input().split()))

# On parcourt la liste depuis la fin, en gardant le maximum de ce qui suit.
plus_grand = -1
positions = []
for i in range(n - 1, -1, -1):
    if liste[i] > plus_grand:
        positions.append(i + 1)
        plus_grand = liste[i]

# Les positions ont été trouvées de droite à gauche : on les remet dans l'ordre.
positions.reverse()
print(len(positions))
print(" ".join(map(str, positions)))
