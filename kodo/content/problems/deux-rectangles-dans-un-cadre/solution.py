w, h = map(int, input().split())
a, b = map(int, input().split())
c, d = map(int, input().split())

# Deux rectangles sont côte à côte, ou l'un au-dessus de l'autre.
# Chacun peut être tourné : on essaie les 4 combinaisons de sens.
possible = False

# Premier rectangle A sur B, second C sur D.
if a + c <= w and b <= h and d <= h:
    possible = True
if b + d <= h and a <= w and c <= w:
    possible = True
# Premier rectangle A sur B, second tourné : D sur C.
if a + d <= w and b <= h and c <= h:
    possible = True
if b + c <= h and a <= w and d <= w:
    possible = True
# Premier rectangle tourné : B sur A, second C sur D.
if b + c <= w and a <= h and d <= h:
    possible = True
if a + d <= h and b <= w and c <= w:
    possible = True
# Les deux tournés : B sur A, et D sur C.
if b + d <= w and a <= h and c <= h:
    possible = True
if a + c <= h and b <= w and d <= w:
    possible = True

if possible:
    print("OUI")
else:
    print("NON")
