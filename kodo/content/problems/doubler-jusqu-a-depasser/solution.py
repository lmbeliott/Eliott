a, b = map(int, input().split())
colonie = a
heures = 0
while colonie <= b:          # pas encore strictement plus de B
    colonie = colonie * 2
    heures = heures + 1
print(heures)
