h, m, d = map(int, input().split())
t = 60 * h + m + d        # minutes depuis 0 h 00, peut être négatif
t = t % 1440              # en Python, toujours entre 0 et 1439
print(t // 60, t % 60)
