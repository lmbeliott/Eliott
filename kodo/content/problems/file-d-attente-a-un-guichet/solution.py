n = int(input())
libre = 0            # instant où le guichet sera libre
attente = 0
for i in range(n):
    t, d = map(int, input().split())
    if libre <= t:
        debut = t        # le guichet est libre : servi tout de suite
    else:
        debut = libre    # il attend la fin du client précédent
    attente = attente + (debut - t)
    libre = debut + d
print(attente, libre)
