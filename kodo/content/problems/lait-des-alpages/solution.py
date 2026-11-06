n = int(input())

# L'accumulateur commence à 0, avant la boucle.
total = 0
for i in range(n):
    litres = int(input())
    total = total + litres

# On affiche le total une seule fois, après la boucle.
print(total)
