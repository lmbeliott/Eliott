# Le nombre de tommes et la taille d'une caisse.
n, k = map(int, input().split())

# Le quotient donne les caisses pleines, le reste les tommes qui restent.
print(n // k)
print(n % k)
