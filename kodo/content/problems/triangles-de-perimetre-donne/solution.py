p = int(input())
nombre = 0
a = 1
while 3 * a <= p:                 # a est le plus petit côté
    b = a
    while a + 2 * b <= p:         # b <= c
        c = p - a - b
        if a + b > c:
            nombre = nombre + 1
        b = b + 1
    a = a + 1
print(nombre)
