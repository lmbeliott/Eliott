a, b = map(int, input().split())
inferieur = a // b
superieur = (a + b - 1) // b
proche = (2 * a + b) // (2 * b)    # arrondi inférieur de a/b + 1/2
print(inferieur, superieur, proche)
