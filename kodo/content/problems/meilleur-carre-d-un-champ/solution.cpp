#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    int n, m, k;
    cin >> n >> m >> k;
    // s[i][j] = nombre d'arbres des lignes 1..i et colonnes 1..j (ligne 0 et colonne 0 à zéro)
    vector<vector<int>> s(n + 1, vector<int>(m + 1, 0));
    for (int i = 1; i <= n; i++) {
        string ligne;
        cin >> ligne;
        for (int j = 1; j <= m; j++) {
            s[i][j] = s[i - 1][j] + s[i][j - 1] - s[i - 1][j - 1] + (ligne[j - 1] - '0');
        }
    }
    int meilleur = -1, ligne_res = 0, col_res = 0;
    for (int i = k; i <= n; i++) {
        for (int j = k; j <= m; j++) {
            // carré de coin en bas à droite (i, j)
            int total = s[i][j] - s[i - k][j] - s[i][j - k] + s[i - k][j - k];
            if (total > meilleur) {   // strictement meilleur : on garde le premier
                meilleur = total;
                ligne_res = i - k + 1;
                col_res = j - k + 1;
            }
        }
    }
    cout << meilleur << " " << ligne_res << " " << col_res << "\n";
    return 0;
}
