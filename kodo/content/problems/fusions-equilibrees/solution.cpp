#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<long long> a(n), pref(n + 1, 0);  // pref[i] = a[0] + ... + a[i-1]
    for (int i = 0; i < n; i++) {
        cin >> a[i];
        pref[i + 1] = pref[i] + a[i];
    }

    // cout_[i][j] = coût minimal pour fusionner a[i..j] en un seul nombre.
    vector<vector<long long>> cout_(n, vector<long long>(n, 0));
    for (int longueur = 2; longueur <= n; longueur++) {
        for (int i = 0; i + longueur - 1 < n; i++) {
            int j = i + longueur - 1;
            long long meilleur = -1;
            // La dernière fusion réunit a[i..k] et a[k+1..j].
            for (int k = i; k < j; k++) {
                long long gauche = pref[k + 1] - pref[i];
                long long droite = pref[j + 1] - pref[k + 1];
                long long ecart = gauche > droite ? gauche - droite : droite - gauche;
                long long c = cout_[i][k] + cout_[k + 1][j] + ecart;
                if (meilleur < 0 || c < meilleur) meilleur = c;
            }
            cout_[i][j] = meilleur;
        }
    }

    cout << cout_[0][n - 1] << "\n";
    return 0;
}
