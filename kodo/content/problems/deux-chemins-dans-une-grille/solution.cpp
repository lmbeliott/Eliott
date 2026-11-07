#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int r, c;
    cin >> r >> c;
    vector<string> grille(r);
    for (auto& ligne : grille) cin >> ligne;
    // valeur[i][j] : chiffre de la case, ou -1 si elle est interdite
    vector<vector<int>> valeur(r, vector<int>(c));
    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++) valeur[i][j] = grille[i][j] == '#' ? -1 : grille[i][j] - '0';

    // On fait avancer les deux chemins en même temps : après s mouvements, chacun est
    // sur une case (i, s - i). L'état est le couple des lignes (i1, i2), avec i1 <= i2.
    // meilleur[i1][i2] : meilleure valeur totale, ou -1 si l'état est impossible.
    vector<vector<int>> meilleur(r, vector<int>(r, -1));
    if (valeur[0][0] >= 0) meilleur[0][0] = valeur[0][0];
    for (int s = 1; s <= r + c - 2; s++) {
        vector<vector<int>> nouveau(r, vector<int>(r, -1));
        int bas = max(0, s - (c - 1));
        int haut = min(r - 1, s);
        for (int i1 = bas; i1 <= haut; i1++) {
            int v1 = valeur[i1][s - i1];
            if (v1 < 0) continue;
            for (int i2 = i1; i2 <= haut; i2++) {
                int v2 = valeur[i2][s - i2];
                if (v2 < 0) continue;
                // chaque chemin vient de la case au-dessus (ligne - 1) ou à gauche (même ligne)
                int best = -1;
                for (int p1 = i1 - 1; p1 <= i1; p1++) {
                    for (int p2 = i2 - 1; p2 <= i2; p2++) {
                        if (p1 < 0 || p2 < 0) continue;
                        best = max(best, meilleur[min(p1, p2)][max(p1, p2)]);
                    }
                }
                // une case visitée par les deux chemins ne compte qu'une fois
                if (best >= 0) nouveau[i1][i2] = best + v1 + (i2 != i1 ? v2 : 0);
            }
        }
        meilleur = nouveau;
    }

    cout << meilleur[r - 1][r - 1] << "\n";
    return 0;
}
