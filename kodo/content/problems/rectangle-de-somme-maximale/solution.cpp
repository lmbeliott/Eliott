#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

// plus grande somme d'une portion non vide de t (balayage du cours)
long long meilleurePortion(const vector<long long> &t) {
    long long courant = t[0];
    long long meilleur = t[0];
    for (int i = 1; i < (int) t.size(); i++) {
        if (courant >= 0) {
            courant += t[i];
        } else {
            courant = t[i];
        }
        meilleur = max(meilleur, courant);
    }
    return meilleur;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int r, c;
    cin >> r >> c;
    vector<vector<int>> grille(r, vector<int>(c));
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            cin >> grille[i][j];
        }
    }

    long long meilleur = grille[0][0];
    for (int haut = 0; haut < r; haut++) {
        // colonnes[j] : somme de la colonne j entre les lignes haut et bas
        vector<long long> colonnes(c, 0);
        for (int bas = haut; bas < r; bas++) {
            for (int j = 0; j < c; j++) {
                colonnes[j] += grille[bas][j];
            }
            meilleur = max(meilleur, meilleurePortion(colonnes));
        }
    }
    cout << meilleur << "\n";
    return 0;
}
