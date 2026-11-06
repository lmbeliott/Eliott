#include <iostream>
#include <string>
#include <vector>
using namespace std;

const int ROCHER = 0, LIBRE = 1, REFUGE = 2;
const int JAMAIS = 1000000000;  // minute d'inondation d'une case que l'eau n'atteint jamais

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int r, c;
    cin >> r >> c;

    // Carte entourée d'une bordure de rochers ; la case (i, j) devient i * largeur + j.
    int largeur = c + 2;
    int taille = (r + 2) * largeur;
    vector<int> nature(taille, ROCHER);
    vector<int> eau(taille, JAMAIS);
    vector<int> fileEau;
    int theo = 0;
    for (int i = 0; i < r; i++) {
        string ligne;
        cin >> ligne;
        for (int j = 0; j < c; j++) {
            char ch = ligne[j];
            int k = (i + 1) * largeur + (j + 1);
            if (ch == '#') continue;
            nature[k] = (ch == 'R') ? REFUGE : LIBRE;
            if (ch == 'E') {
                eau[k] = 0;
                fileEau.push_back(k);
            } else if (ch == 'T') {
                theo = k;
            }
        }
    }

    // 1) L'eau : parcours en largeur depuis toutes les sources, arrêté par rochers et refuges.
    for (size_t tete = 0; tete < fileEau.size(); tete++) {
        int u = fileEau[tete];
        int voisines[4] = {u - 1, u + 1, u - largeur, u + largeur};
        for (int v : voisines) {
            if (nature[v] == LIBRE && eau[v] == JAMAIS) {
                eau[v] = eau[u] + 1;
                fileEau.push_back(v);
            }
        }
    }

    // 2) Théo : parcours en largeur, en n'entrant que dans les cases encore sèches.
    vector<int> minute(taille, -1);
    vector<int> file;
    minute[theo] = 0;
    file.push_back(theo);
    for (size_t tete = 0; tete < file.size(); tete++) {
        int u = file[tete];
        int t = minute[u] + 1;
        int voisines[4] = {u - 1, u + 1, u - largeur, u + largeur};
        for (int v : voisines) {
            if (nature[v] == ROCHER || minute[v] != -1) continue;
            if (nature[v] == REFUGE) {
                cout << t << "\n";
                return 0;
            }
            if (t < eau[v]) {
                minute[v] = t;
                file.push_back(v);
            }
        }
    }

    cout << -1 << "\n";
    return 0;
}
