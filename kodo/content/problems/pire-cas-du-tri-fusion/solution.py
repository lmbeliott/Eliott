import sys

memo = {1: 0}

def comparaisons(n):
    # pire nombre de comparaisons du tri fusion sur n éléments
    if n in memo:
        return memo[n]
    r = comparaisons(n // 2) + comparaisons((n + 1) // 2) + n - 1
    memo[n] = r
    return r

donnees = sys.stdin.read().split()
t = int(donnees[0])
print("\n".join(str(comparaisons(int(donnees[1 + i]))) for i in range(t)))
