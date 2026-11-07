import sys

fib = [1, 2]
while fib[-1] + fib[-2] <= 10**18:
    fib.append(fib[-1] + fib[-2])

def termes(n):
    nb = 0
    i = len(fib) - 1
    while n > 0:
        while fib[i] > n:       # plus grand nombre de Fibonacci au plus n
            i -= 1
        n -= fib[i]
        nb += 1
    return nb

donnees = sys.stdin.read().split()
t = int(donnees[0])
print("\n".join(str(termes(int(donnees[1 + i]))) for i in range(t)))
