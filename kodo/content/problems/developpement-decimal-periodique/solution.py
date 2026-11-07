n, d = map(int, input().split())
entier = n // d
reste = n % d

chiffres = []        # les chiffres après la virgule
position = {}        # reste -> position du chiffre qu'il va produire
while reste != 0 and reste not in position:
    position[reste] = len(chiffres)
    reste = reste * 10
    chiffres.append(str(reste // d))   # division posée : un chiffre de plus
    reste = reste % d

if len(chiffres) == 0:
    print(entier)
elif reste == 0:                       # le développement s'arrête
    print(str(entier) + "." + "".join(chiffres))
else:                                  # le reste revient : la suite se répète
    debut = position[reste]
    print(str(entier) + "." + "".join(chiffres[:debut]) + "(" + "".join(chiffres[debut:]) + ")")
