#include <iostream>
#include <string>
#include <vector>
using namespace std;

const int MUR = 0, LIBRE = 1, SORTIE = 2;
const int JAMAIS = 1000000000;  // minute de contamination d'une case jamais atteinte

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int r, c;
    cin >> r >> c;

    // Grille entourée d'une bordure de murs ; la case (i, j) devient i * largeur + j.
    int largeur = c + 2;
    int taille = (r + 2) * largeur;
    vector<int> nature(taille, MUR);
    vector<int> conta(taille, JAMAIS);
    vector<int> fileConta;
    int depart = 0;
    for (int i = 0; i < r; i++) {
        string ligne;
        cin >> ligne;
        for (int j = 0; j < c; j++) {
            char ch = ligne[j];
            int k = (i + 1) * largeur + (j + 1);
            if (ch == '#') continue;
            nature[k] = (ch == 'X') ? SORTIE : LIBRE;
            if (ch == '*') {
                conta[k] = 0;
                fileConta.push_back(k);
            } else if (ch == '@') {
                depart = k;
            }
        }
    }

    // 1) La contamination : parcours en largeur depuis toutes les sources, arrêté par murs et sorties.
    for (size_t tete = 0; tete < fileConta.size(); tete++) {
        int u = fileConta[tete];
        int voisines[4] = {u - 1, u + 1, u - largeur, u + largeur};
        for (int v : voisines) {
            if (nature[v] == LIBRE && conta[v] == JAMAIS) {
                conta[v] = conta[u] + 1;
                fileConta.push_back(v);
            }
        }
    }

    // 2) Le pion : parcours en largeur, en n'entrant que dans les cases encore saines.
    vector<int> minute(taille, -1);
    vector<int> file;
    minute[depart] = 0;
    file.push_back(depart);
    for (size_t tete = 0; tete < file.size(); tete++) {
        int u = file[tete];
        int t = minute[u] + 1;
        int voisines[4] = {u - 1, u + 1, u - largeur, u + largeur};
        for (int v : voisines) {
            if (nature[v] == MUR || minute[v] != -1) continue;
            if (nature[v] == SORTIE) {
                cout << t << "\n";
                return 0;
            }
            if (t < conta[v]) {
                minute[v] = t;
                file.push_back(v);
            }
        }
    }

    cout << -1 << "\n";
    return 0;
}
