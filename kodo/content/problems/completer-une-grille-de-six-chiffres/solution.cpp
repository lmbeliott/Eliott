#include <iostream>
#include <string>
#include <utility>
#include <vector>
using namespace std;

int grille[6][6], ligne_m[6], col_m[6], bloc_m[6];
vector<pair<int, int>> vides;
const int TOUS = 0b1111110;             // chiffres 1 à 6

int bloc(int i, int j) { return (i / 2) * 2 + j / 3; }   // blocs de 2 lignes et 3 colonnes

long long compter() {
    // on remplit d'abord la case vide qui a le moins de chiffres possibles
    int meilleure = -1, meilleur_choix = 0, nb_min = 7;
    for (int k = 0; k < (int)vides.size(); k++) {
        auto [i, j] = vides[k];
        if (grille[i][j] != 0) continue;
        int possibles = TOUS & ~(ligne_m[i] | col_m[j] | bloc_m[bloc(i, j)]);
        int nb = __builtin_popcount(possibles);
        if (nb < nb_min) {
            nb_min = nb;
            meilleure = k;
            meilleur_choix = possibles;
        }
    }
    if (meilleure == -1) return 1;       // grille pleine : une complétion
    auto [i, j] = vides[meilleure];
    long long total = 0;
    for (int d = 1; d <= 6; d++) {
        if (!((meilleur_choix >> d) & 1)) continue;
        int bit = 1 << d;
        grille[i][j] = d;
        ligne_m[i] |= bit;
        col_m[j] |= bit;
        bloc_m[bloc(i, j)] |= bit;
        total += compter();
        ligne_m[i] &= ~bit;
        col_m[j] &= ~bit;
        bloc_m[bloc(i, j)] &= ~bit;
        grille[i][j] = 0;
    }
    return total;
}

int main() {
    bool coherente = true;
    for (int i = 0; i < 6; i++) {
        string s;
        cin >> s;
        for (int j = 0; j < 6; j++) {
            int d = (s[j] == '.') ? 0 : s[j] - '0';
            grille[i][j] = d;
            if (d == 0) {
                vides.push_back({i, j});
            } else {
                int bit = 1 << d;
                if ((ligne_m[i] | col_m[j] | bloc_m[bloc(i, j)]) & bit) coherente = false;   // deux chiffres identiques au départ
                ligne_m[i] |= bit;
                col_m[j] |= bit;
                bloc_m[bloc(i, j)] |= bit;
            }
        }
    }
    cout << (coherente ? compter() : 0) << "\n";
    return 0;
}
