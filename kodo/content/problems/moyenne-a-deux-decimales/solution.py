n = int(input())
somme = 0
for morceau in input().split():
    somme = somme + int(morceau)
moyenne = somme / n          # division décimale
print(f"{moyenne:.2f}")
