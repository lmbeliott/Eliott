l1, c1 = map(int, input().split())
l2, c2 = map(int, input().split())

# Une case est noire quand la somme ligne + colonne est paire.
if (l1 + c1) % 2 == (l2 + c2) % 2:
    print("OUI")
else:
    print("NON")
