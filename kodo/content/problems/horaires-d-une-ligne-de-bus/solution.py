t = 360  # 6 h 00, en minutes depuis minuit
for i in range(40):
    # Heures entières et minutes restantes.
    print(t // 60, t % 60)
    t = t + 25
