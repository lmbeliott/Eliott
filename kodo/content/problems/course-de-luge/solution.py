# Le temps de Mia, puis celui de Théo.
a, b = map(int, input().split())

# Le plus petit temps gagne.
if a < b:
    print("MIA")
elif b < a:
    print("THEO")
else:
    print("EGALITE")
