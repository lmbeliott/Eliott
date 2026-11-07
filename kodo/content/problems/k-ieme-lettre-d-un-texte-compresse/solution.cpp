#include <cctype>
#include <iostream>
#include <string>
#include <utility>
#include <vector>
using namespace std;

// Un morceau est un couple (a, g) :
// - une lettre si g = -1, et a est alors le code de la lettre ;
// - un groupe sinon : le texte numéro g, répété a fois.
string s;
vector<vector<pair<long long, int>>> textes;   // textes[g] = morceaux du texte numéro g
vector<long long> longueurs;                   // longueurs[g] = longueur développée du texte g

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
            textes[g].push_back({c, sous});
            longueurs[g] += c * longueurs[sous];
        } else {
            textes[g].push_back({s[i], -1});
            longueurs[g] += 1;
            i++;
        }
    }
    return g;
}

// k-ième lettre (k >= 1) du texte développé numéro g
char chercher(int g, long long k) {
    for (const pair<long long, int> &m : textes[g]) {
        if (m.second == -1) {
            if (k == 1) {
                return (char)m.first;
            }
            k--;
        } else {
            long long lg = longueurs[m.second];
            if (k <= m.first * lg) {
                return chercher(m.second, (k - 1) % lg + 1);
            }
            k -= m.first * lg;
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
