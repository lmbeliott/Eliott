#include <algorithm>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string s;
    cin >> s;
    int n = s.size();

    // z[i] = longueur du plus long préfixe commun à s et à s[i..]
    vector<int> z(n, 0);
    z[0] = n;
    int g = 0, d = 0;  // [g, d[ : la boîte Z qui va le plus loin à droite
    for (int i = 1; i < n; i++) {
        if (i < d) z[i] = min(d - i, z[i - g]);
        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) z[i]++;
        if (i + z[i] > d) {
            g = i;
            d = i + z[i];
        }
    }

    // Le préfixe de longueur L commence en i exactement quand z[i] >= L.
    // parValeur[v] : les positions i telles que z[i] = v
    vector<vector<int>> parValeur(n + 1);
    for (int i = 0; i < n; i++) parValeur[z[i]].push_back(i);

    // Liste doublement chaînée des positions encore présentes, terminée par la sentinelle n
    vector<int> precedent(n + 1), suivant(n + 1);
    for (int i = 0; i <= n; i++) {
        precedent[i] = i - 1;
        suivant[i] = i + 1;
    }
    int ecartMax = 1;  // plus grand écart entre deux positions présentes consécutives (sentinelle comprise)

    vector<int> longueurs;
    for (int L = 1; L <= n; L++) {
        // Les positions où z[i] = L - 1 ne sont plus des occurrences du préfixe de longueur L.
        for (int i : parValeur[L - 1]) {
            int a = precedent[i], b = suivant[i];
            suivant[a] = b;
            precedent[b] = a;
            ecartMax = max(ecartMax, b - a);
        }
        // Le préfixe couvre le mot si chaque occurrence touche la suivante, et la dernière finit en n.
        if (ecartMax <= L) longueurs.push_back(L);
    }
    cout << longueurs.size() << "\n";
    for (size_t k = 0; k < longueurs.size(); k++) {
        if (k) cout << ' ';
        cout << longueurs[k];
    }
    cout << "\n";
    return 0;
}
