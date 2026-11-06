n, s = map(int, input().split())
codes = []
code = []

def explorer(reste, plus_petit):
    # reste : somme encore à atteindre ; plus_petit : chiffre minimal autorisé
    places = n - len(code)          # nombre de chiffres encore à choisir
    if places == 0:
        if reste == 0:
            codes.append("".join(map(str, code)))
        return
    for c in range(plus_petit, 10):
        if c * places > reste:
            break                   # les chiffres suivants sont >= c : trop grand
        if c + 9 * (places - 1) < reste:
            continue                # même avec des 9 ensuite, la somme est trop petite
        code.append(c)
        explorer(reste - c, c)
        code.pop()

explorer(s, 0)
print(len(codes))
for c in codes:
    print(c)
