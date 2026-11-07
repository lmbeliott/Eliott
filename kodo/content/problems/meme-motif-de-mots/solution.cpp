#include <iostream>
#include <string>
#include <vector>
#include <map>
using namespace std;

bool meme_motif(const string& motif, const vector<string>& mots) {
    if (motif.size() != mots.size()) {
        return false;
    }
    map<char, string> mot_de;      // lettre -> mot
    map<string, char> lettre_de;   // mot -> lettre
    for (int i = 0; i < (int)motif.size(); i++) {
        char c = motif[i];
        string m = mots[i];
        if (mot_de.count(c) > 0 && mot_de[c] != m) {
            return false;          // une même lettre, deux mots différents
        }
        if (lettre_de.count(m) > 0 && lettre_de[m] != c) {
            return false;          // un même mot, deux lettres différentes
        }
        mot_de[c] = m;
        lettre_de[m] = c;
    }
    return true;
}

int main() {
    string motif;
    cin >> motif;
    vector<string> mots;
    string m;
    while (cin >> m) {          // lit tous les mots jusqu'à la fin de l'entrée
        mots.push_back(m);
    }
    if (meme_motif(motif, mots)) {
        cout << "OUI\n";
    } else {
        cout << "NON\n";
    }
    return 0;
}
