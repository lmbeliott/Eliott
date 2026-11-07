a, b = map(int, input().split())
nombre = 0
for n in range(a, b + 1):
    m = n                 # copie : la boucle while la détruit
    s = 0                 # somme des chiffres de n
    while m > 0:
        s = s + m % 10
        m = m // 10
    if n % s == 0:
        nombre = nombre + 1
print(nombre)
