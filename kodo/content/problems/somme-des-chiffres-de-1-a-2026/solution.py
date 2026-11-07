total = 0
for n in range(1, 2027):
    # Les quatre chiffres de n (ceux qui manquent valent 0).
    unites = n % 10
    dizaines = n // 10 % 10
    centaines = n // 100 % 10
    milliers = n // 1000
    total = total + unites + dizaines + centaines + milliers
print(total)
