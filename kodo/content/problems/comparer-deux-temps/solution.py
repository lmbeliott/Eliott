# Le temps du coureur 1, puis celui du coureur 2.
a, b = map(int, input().split())

# Le plus petit temps gagne.
if a < b:
    print(1)
elif b < a:
    print(2)
else:
    print("EGALITE")
