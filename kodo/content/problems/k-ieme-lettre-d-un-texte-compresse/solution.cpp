#include <iostream>
#include <string>
#include <vector>
using namespace std;

// Un morceau est une lettre (groupe = -1) ou un groupe répété c fois.
struct Morceau {
    char lettre;
    long long c;
    int groupe;        // numéro du texte entre parenthèses, -1 pour une lettre
};

string s;
vector<vector<Morceau>> textes;   // textes[g] = morceaux du texte numéro g
vector<long long> longueurs;      // longueurs[g] = longueur développée du texte g

// lit le texte qui commence en i, jusqu'à une ')' ou la fin ; renvoie son numéro
int lire_texte(int &i) {
    int g = textes.size();
    textes.push_back({});
    longueurs.push_back(0);
    while (i < (int)s.size() && s[i] != ')') {
        if (isdigit(s[i])) {
            long long c = 0;
            while (isdigit(s[i])) {
                c = c * 10 + (s[i] - '0');
                i++;
            }
            i++;                         // saute '('
            int sous = lire_texte(i);
            i++;                         // saute ')'
            textes[g].push_back({' ', c, sous});
            longueurs[g] += c * longueurs[sous];
        } else {
            textes[g].push_back({s[i], 1, -1});
            longueurs[g] += 1;
            i++;
        }
    }
    return g;
}

// k-ième lettre (k >= 1) du texte développé numéro g
char chercher(int g, long long k) {
    for (const Morceau &m : textes[g]) {
        if (m.groupe == -1) {
            if (k == 1) {
                return m.lettre;
            }
            k--;
        } else {
            long long lg = longueurs[m.groupe];
            if (k <= m.c * lg) {
                return chercher(m.groupe, (k - 1) % lg + 1);
            }
            k -= m.c * lg;
        }
    }
    return '?';
}

int main() {
    cin >> s;
    int i = 0;
    int racine = lire_texte(i);
    int q;
    cin >> q;
    for (int j = 0; j < q; j++) {
        long long k;
        cin >> k;
        cout << chercher(racine, k) << "\n";
    }
    return 0;
}
