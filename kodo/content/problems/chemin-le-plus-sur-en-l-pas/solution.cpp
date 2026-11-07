#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int r, c, lmax, largeur, depart, arrivee;
vector<int> valeur;

// Parcours en largeur sur les cases de valeur >= seuil : arrivée en au plus lmax pas ?
bool atteignable(int seuil) {
    if (valeur[depart] < seuil || valeur[arrivee] < seuil) return false;
    if (depart == arrivee) return true;
    vector<int> dist(valeur.size(), -1);
    vector<int> file;
    dist[depart] = 0;
    file.push_back(depart);
    int pas[4] = {1, -1, largeur, -largeur};
    for (size_t tete = 0; tete < file.size(); tete++) {
        int u = file[tete];
        if (dist[u] == lmax) return false;  // la file est triée par distance
        for (int delta : pas) {
            int v = u + delta;
            if (valeur[v] >= seuil && dist[v] == -1) {
                if (v == arrivee) return true;  // atteinte en dist[u] + 1 <= lmax pas
                dist[v] = dist[u] + 1;
                file.push_back(v);
            }
        }
    }
    return false;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin >> r >> c >> lmax;
    // Grille entourée d'une bordure de cases interdites (valeur 0) ; (i, j) -> i * largeur + j
    largeur = c + 2;
    valeur.assign((r + 2) * largeur, 0);
    for (int i = 1; i <= r; i++)
        for (int j = 1; j <= c; j++) cin >> valeur[i * largeur + j];
    depart = largeur + 1;
    arrivee = r * largeur + c;

    // Les qualités possibles sont les valeurs de la grille ; plus le seuil est bas, plus c'est facile.
    vector<int> candidats;
    for (int x : valeur)
        if (x > 0) candidats.push_back(x);
    sort(candidats.begin(), candidats.end());
    candidats.erase(unique(candidats.begin(), candidats.end()), candidats.end());
    if (!atteignable(candidats[0])) {
        cout << -1 << "\n";
        return 0;
    }
    int bas = 0, haut = candidats.size() - 1;
    while (bas < haut) {
        int milieu = (bas + haut + 1) / 2;
        if (atteignable(candidats[milieu])) bas = milieu;
        else haut = milieu - 1;
    }
    cout << candidats[bas] << "\n";
    return 0;
}
