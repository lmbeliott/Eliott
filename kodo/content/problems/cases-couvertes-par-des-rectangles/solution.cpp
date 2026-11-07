#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, q, k;
    cin >> n >> m >> q >> k;

    // Tableau de différences en deux dimensions : quatre coins par rectangle.
    vector<vector<int>> diff(n + 2, vector<int>(m + 2, 0));
    for (int i = 0; i < q; i++) {
        int r1, c1, r2, c2;
        cin >> r1 >> c1 >> r2 >> c2;
        diff[r1][c1] += 1;
        diff[r1][c2 + 1] -= 1;
        diff[r2 + 1][c1] -= 1;
        diff[r2 + 1][c2 + 1] += 1;
    }

    // Sommes cumulées : couverture[r][c] = somme des diff[x][y] pour x ≤ r et y ≤ c.
    long long total = 0;
    vector<int> au_dessus(m + 2, 0);   // la ligne précédente, déjà cumulée
    for (int r = 1; r <= n; r++) {
        int cumul = 0;                 // somme de la ligne r, de la colonne 1 à c
        vector<int> courante(m + 2, 0);
        for (int c = 1; c <= m; c++) {
            cumul += diff[r][c];
            int couverture = au_dessus[c] + cumul;
            courante[c] = couverture;
            if (couverture >= k) total++;
        }
        au_dessus = courante;
    }
    cout << total << "\n";
    return 0;
}
