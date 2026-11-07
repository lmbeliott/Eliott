s, n = map(int, input().split())
solde = s
for i in range(n):
    operation = int(input())
    # Un retrait est un nombre négatif : on l'ajoute aussi.
    solde = solde + operation
print(solde)
