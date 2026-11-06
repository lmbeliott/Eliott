# Le nombre d'objets et la taille d'une boîte.
n, k = map(int, input().split())

# Le quotient donne les boîtes pleines, le reste les objets qui restent.
print(n // k)
print(n % k)
