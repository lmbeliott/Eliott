j1, m1, a1 = map(int, input().split())
j2, m2, a2 = map(int, input().split())
# L'année décide d'abord, puis le mois, puis le jour.
if a1 < a2:
    print(j1, m1, a1)
elif a1 > a2:
    print(j2, m2, a2)
elif m1 < m2:
    print(j1, m1, a1)
elif m1 > m2:
    print(j2, m2, a2)
elif j1 <= j2:
    print(j1, m1, a1)
else:
    print(j2, m2, a2)
