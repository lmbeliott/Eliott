#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    string u, v;
    cin >> u >> v;
    int n = u.size(), m = v.size();
    const int INF = 1000000000;
    // fin_u[i][j] : nombre minimal de blocs d'un entrelacement de u[:i] et v[:j] qui se termine par u[i-1]
    // fin_v[i][j] : pareil, mais l'entrelacement se termine par v[j-1]
    vector<vector<int>> fin_u(n + 1, vector<int>(m + 1, INF)), fin_v(n + 1, vector<int>(m + 1, INF));
    for (int i = 0; i <= n; i++) {
        for (int j = 0; j <= m; j++) {
            if (i > 0) {
                char c = u[i - 1];
                if (i == 1 && j == 0) {
                    fin_u[i][j] = 1;
                } else {
                    // la lettre précédente est u[i-2] ou v[j-1]
                    int meilleur = INF;
                    if (i >= 2) meilleur = fin_u[i - 1][j] + (u[i - 2] != c);
                    if (j >= 1) meilleur = min(meilleur, fin_v[i - 1][j] + (v[j - 1] != c));
                    fin_u[i][j] = meilleur;
                }
            }
            if (j > 0) {
                char c = v[j - 1];
                if (i == 0 && j == 1) {
                    fin_v[i][j] = 1;
                } else {
                    int meilleur = INF;
                    if (j >= 2) meilleur = fin_v[i][j - 1] + (v[j - 2] != c);
                    if (i >= 1) meilleur = min(meilleur, fin_u[i][j - 1] + (u[i - 1] != c));
                    fin_v[i][j] = meilleur;
                }
            }
        }
    }
    cout << min(fin_u[n][m], fin_v[n][m]) << "\n";
    return 0;
}
