n = int(input())
# Le premier saut est toujours un record.
meilleur = int(input())
records = 1
for i in range(n - 1):
    x = int(input())
    if x > meilleur:
        records = records + 1
        meilleur = x
print(records)
