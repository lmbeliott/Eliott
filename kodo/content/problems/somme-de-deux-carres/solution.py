n = int(input())

# Premier passage : compter les couples (a, b) avec a <= b.
nombre = 0
a = 0
while 2 * a * a <= n:
    b = a
    while a * a + b * b <= n:
        if a * a + b * b == n:
            nombre = nombre + 1
        b = b + 1
    a = a + 1
print(nombre)

# Second passage : les mêmes boucles, pour afficher les couples.
a = 0
while 2 * a * a <= n:
    b = a                       # b repart de a à chaque tour externe
    while a * a + b * b <= n:
        if a * a + b * b == n:
            print(a, b)
        b = b + 1
    a = a + 1
