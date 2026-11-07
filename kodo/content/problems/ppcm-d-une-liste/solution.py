from math import gcd

LIMITE = 10**18
n = int(input())
nombres = list(map(int, input().split()))

ppcm = 1
for b in nombres:
    q = ppcm // gcd(ppcm, b)
    if q > LIMITE // b:          # q × b dépasserait 10^18
        ppcm = -1
        break
    ppcm = q * b
print(ppcm)
