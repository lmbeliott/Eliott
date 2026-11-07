s, k, a, b = map(int, input().split())

# Nombre de marchés du jour 1 au jour X (pour X ≥ S - 1) : (X - S + K) // K.
jusqu_a_b = (b - s + k) // k
avant_a = (a - 1 - s + k) // k

# Les marchés entre A et B : ceux jusqu'au jour B, sauf ceux d'avant A.
print(jusqu_a_b - avant_a)
