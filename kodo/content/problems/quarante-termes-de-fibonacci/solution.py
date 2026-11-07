a = 1  # le terme à afficher
b = 1  # le terme suivant
for i in range(40):
    print(a)
    # On avance d'un cran : on calcule le nouveau terme avant d'écraser a.
    c = a + b
    a = b
    b = c
