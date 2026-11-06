#include <algorithm>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int r, c;
    cin >> r >> c;

    // On entoure la carte d'une bordure de rochers et on numérote les cases :
    // la case (i, j) devient i * largeur + j. Ses voisines sont k ± 1 et k ± largeur.
    int largeur = c + 2;
    int taille = (r + 2) * largeur;
    vector<char> libre(taille, 0);
    vector<int> dist(taille, -1);
    vector<int> file;
    file.reserve(taille);
    for (int i = 0; i < r; i++) {
        string ligne;
        cin >> ligne;
        for (int j = 0; j < c; j++) {
            if (ligne[j] == '#') continue;
            int k = (i + 1) * largeur + (j + 1);
            libre[k] = 1;
            if (ligne[j] == 'A') {
                // Tous les abris partent ensemble, à distance 0.
                dist[k] = 0;
                file.push_back(k);
            }
        }
    }

    // Parcours en largeur à sources multiples : file[tete] est la prochaine case à traiter.
    for (size_t tete = 0; tete < file.size(); tete++) {
        int u = file[tete];
        int voisines[4] = {u - 1, u + 1, u - largeur, u + largeur};
        for (int v : voisines) {
            if (libre[v] && dist[v] < 0) {
                dist[v] = dist[u] + 1;
                file.push_back(v);
            }
        }
    }

    int plusLoin = 0, sansAbri = 0;
    for (int k = 0; k < taille; k++) {
        plusLoin = max(plusLoin, dist[k]);
        if (libre[k] && dist[k] < 0) sansAbri++;
    }
    cout << plusLoin << "\n" << sansAbri << "\n";
    return 0;
}
