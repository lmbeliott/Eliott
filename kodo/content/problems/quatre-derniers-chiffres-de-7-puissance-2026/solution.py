p = 1
for i in range(2026):
    # On multiplie par 7 et on ne garde que les quatre derniers chiffres.
    p = p * 7 % 10000
print(p)
