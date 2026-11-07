#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, t;
    cin >> n >> m >> t;
    vector<string> grille(n);
    for (int i = 0; i < n; i++) cin >> grille[i];

    // pref[i][j] = nombre de cases marquées dans le rectangle des i premières lignes
    // et des j premières colonnes
    vector<vector<int>> pref(n + 1, vector<int>(m + 1, 0));
    for (int i = 1; i <= n; i++) {
        int somme_ligne = 0;
        for (int j = 1; j <= m; j++) {
            if (grille[i - 1][j - 1] == '#') somme_ligne++;
            pref[i][j] = pref[i - 1][j] + somme_ligne;
        }
    }

    // pour chaque coin bas-droit (i, j), on essaie d'agrandir le meilleur côté trouvé
    int meilleur = 0;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            while (meilleur < i && meilleur < j) {
                int k = meilleur + 1;
                int marquees = pref[i][j] - pref[i - k][j] - pref[i][j - k] + pref[i - k][j - k];
                if (marquees > t) break;
                meilleur = k;
            }
        }
    }
    cout << meilleur << "\n";
    return 0;
}
