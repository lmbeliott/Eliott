def meme_motif(motif, mots):
    if len(motif) != len(mots):
        return False
    mot_de = {}        # lettre -> mot
    lettre_de = {}     # mot -> lettre
    for i in range(len(motif)):
        c = motif[i]
        m = mots[i]
        if c in mot_de and mot_de[c] != m:
            return False           # une même lettre, deux mots différents
        if m in lettre_de and lettre_de[m] != c:
            return False           # un même mot, deux lettres différentes
        mot_de[c] = m
        lettre_de[m] = c
    return True

motif = input()
mots = input().split()
if meme_motif(motif, mots):
    print("OUI")
else:
    print("NON")
