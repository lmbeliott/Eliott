#include <algorithm>
#include <iostream>
#include <string>
using namespace std;

const long long INFINI = (long long)1e15;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int m;
    cin >> m;
    // d[x][y] : coût minimal pour transformer la lettre x en la lettre y
    long long d[26][26];
    for (int x = 0; x < 26; x++)
        for (int y = 0; y < 26; y++) d[x][y] = (x == y ? 0 : INFINI);
    for (int i = 0; i < m; i++) {
        char x, y;
        long long c;
        cin >> x >> y >> c;
        d[x - 'a'][y - 'a'] = min(d[x - 'a'][y - 'a'], c);
    }
    string s, t;
    cin >> s >> t;

    // Floyd-Warshall sur les 26 lettres
    for (int k = 0; k < 26; k++)
        for (int i = 0; i < 26; i++)
            for (int j = 0; j < 26; j++) d[i][j] = min(d[i][j], d[i][k] + d[k][j]);

    // rendre égales les lettres a et b : les transformer toutes deux en une même lettre z
    long long egaliser[26][26];
    for (int a = 0; a < 26; a++)
        for (int b = 0; b < 26; b++) {
            egaliser[a][b] = INFINI;
            for (int z = 0; z < 26; z++) egaliser[a][b] = min(egaliser[a][b], d[a][z] + d[b][z]);
        }

    long long total = 0;
    for (size_t i = 0; i < s.size(); i++) {
        long long c = egaliser[s[i] - 'a'][t[i] - 'a'];
        if (c >= INFINI) {
            cout << -1 << "\n";
            return 0;
        }
        total += c;
    }
    cout << total << "\n";
    return 0;
}
