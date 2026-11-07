n = int(input())
impairs = 0
for morceau in input().split():
    x = int(morceau)
    # x % 2 vaut 1 si x est impair, 0 s'il est pair.
    impairs = impairs + x % 2
print(impairs)
print(n - impairs)
