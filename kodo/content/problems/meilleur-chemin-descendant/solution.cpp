#include <algorithm>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

const long long MOD = 1000000007LL;
const int AUCUNE = -1;  // case inatteignable (ou interdite)

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int r, c;
    cin >> r >> c;
    vector<string> grille(r);
    for (string& ligne : grille) cin >> ligne;

    // meilleur[j + 1] et nombre[j + 1] décrivent la case de colonne j de la ligne courante ;
    // les cases 0 et c + 1 sont des bords toujours inatteignables.
    vector<int> meilleur(c + 2, AUCUNE);
    vector<long long> nombre(c + 2, 0);
    for (int j = 0; j < c; j++) {
        if (grille[0][j] != '#') {
            meilleur[j + 1] = grille[0][j] - '0';
            nombre[j + 1] = 1;
        }
    }

    for (int i = 1; i < r; i++) {
        vector<int> nouvMeilleur(c + 2, AUCUNE);
        vector<long long> nouvNombre(c + 2, 0);
        for (int j = 1; j <= c; j++) {
            if (grille[i][j - 1] == '#') continue;
            // On cherche la meilleure des trois cases du dessus, et combien de chemins y mènent.
            int m = AUCUNE;
            long long n = 0;
            for (int k = j - 1; k <= j + 1; k++) {
                if (meilleur[k] > m) {
                    m = meilleur[k];
                    n = nombre[k];
                } else if (meilleur[k] == m && m != AUCUNE) {
                    n += nombre[k];
                }
            }
            if (m != AUCUNE) {
                nouvMeilleur[j] = m + (grille[i][j - 1] - '0');
                nouvNombre[j] = n % MOD;
            }
        }
        meilleur = nouvMeilleur;
        nombre = nouvNombre;
    }

    int meilleure = *max_element(meilleur.begin(), meilleur.end());
    if (meilleure == AUCUNE) {
        cout << -1 << "\n";
    } else {
        long long total = 0;
        for (int j = 0; j < c + 2; j++) {
            if (meilleur[j] == meilleure) total = (total + nombre[j]) % MOD;
        }
        cout << meilleure << " " << total << "\n";
    }
    return 0;
}
