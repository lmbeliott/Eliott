a = input()
b = input()
neg_a = a[0] == "-"
neg_b = b[0] == "-"
if neg_a and not neg_b:
    print("<")
elif neg_b and not neg_a:
    print(">")
else:
    # même signe : on compare les valeurs absolues (sans le "-")
    va = a
    vb = b
    if neg_a:
        va = a[1:]
        vb = b[1:]
    if len(va) < len(vb):                           # moins de chiffres : plus petit
        compare = -1
    elif len(va) > len(vb):
        compare = 1
    elif va == vb:
        compare = 0
    elif va < vb:                                   # même longueur : ordre des chaînes
        compare = -1
    else:
        compare = 1
    if neg_a:
        compare = -compare                          # deux négatifs : l'ordre s'inverse
    if compare < 0:
        print("<")
    elif compare > 0:
        print(">")
    else:
        print("=")
