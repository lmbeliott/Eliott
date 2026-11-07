#include <algorithm>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

// z[i] = longueur du plus long préfixe commun à s et à s[i..]
vector<int> fonctionZ(const string& s) {
    int n = s.size();
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
    return z;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string p, t;
    cin >> p >> t;
    int m = p.size(), n = t.size();

    // debut[i] : nombre de lettres de P retrouvées en lisant T à partir de i
    vector<int> z = fonctionZ(p + "#" + t);
    vector<int> debut(z.begin() + m + 1, z.end());
    // fin[j] : nombre de lettres de P retrouvées en lisant T vers la gauche à partir de j
    string pr(p.rbegin(), p.rend()), tr(t.rbegin(), t.rend());
    z = fonctionZ(pr + "#" + tr);
    vector<int> fin(n);
    for (int j = 0; j < n; j++) fin[j] = z[m + 1 + (n - 1 - j)];

    vector<int> positions;
    for (int i = 0; i + m <= n; i++) {
        // Au plus une différence : le début et la fin retrouvés couvrent au moins m - 1 lettres.
        if (debut[i] + fin[i + m - 1] >= m - 1) positions.push_back(i + 1);
    }
    cout << positions.size() << "\n";
    for (size_t k = 0; k < positions.size(); k++) {
        if (k) cout << ' ';
        cout << positions[k];
    }
    cout << "\n";
    return 0;
}
