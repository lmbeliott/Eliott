somme = 0
nombre = 0
x = int(input())
while x != 0:
    somme = somme + x
    nombre = nombre + 1
    x = int(input())      # on lit la valeur suivante en dernier
print(somme, nombre)
