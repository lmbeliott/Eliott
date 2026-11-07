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

    // nb[k] = nombre de positions i où z[i] vaut exactement k
    vector<long long> nb(n + 2, 0);
    for (int v : z) nb[v]++;

    // occ(k) = nombre de positions où z[i] >= k
    long long meilleurK = 0, meilleurPoids = -1, occ = 0;
    for (long long k = n; k >= 1; k--) {
        occ += nb[k];
        long long poids = k * occ;
        if (poids >= meilleurPoids) {  // >= : on garde le plus petit k en cas d'égalité
            meilleurK = k;
            meilleurPoids = poids;
        }
    }
    cout << meilleurK << " " << meilleurPoids << "\n";
    return 0;
}
