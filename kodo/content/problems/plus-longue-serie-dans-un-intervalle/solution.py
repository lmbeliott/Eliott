n, a, b = map(int, input().split())
en_cours = 0
record = 0
for morceau in input().split():
    t = int(morceau)
    if a <= t and t <= b:
        en_cours = en_cours + 1
        if en_cours > record:
            record = en_cours
    else:
        en_cours = 0
print(record)
