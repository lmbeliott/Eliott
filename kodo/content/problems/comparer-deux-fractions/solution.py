a, b, c, d = map(int, input().split())
# b et d sont positifs : a/b < c/d équivaut à a*d < c*b (produit en croix)
gauche = a * d
droite = c * b
if gauche < droite:
    print("<")
elif gauche > droite:
    print(">")
else:
    print("=")
