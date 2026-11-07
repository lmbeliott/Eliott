# De -40 à 100 inclus, de 5 en 5. On multiplie par 9 avant de diviser par 5.
for c in range(-40, 101, 5):
    print(c, c * 9 // 5 + 32)
