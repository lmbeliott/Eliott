def pgcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a

def somme_multiples(d, n):
    # somme des multiples de d entre 1 et n
    k = n // d
    return d * (k * (k + 1) // 2)

n, a, b = map(int, input().split())
ppcm = a // pgcd(a, b) * b
print(somme_multiples(a, n) + somme_multiples(b, n) - somme_multiples(ppcm, n))
