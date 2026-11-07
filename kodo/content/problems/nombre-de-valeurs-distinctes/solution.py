n = int(input())
valeurs = input().split()
vues = set()
for v in valeurs:
    vues.add(int(v))        # un ensemble ignore les doublons
print(len(vues))
