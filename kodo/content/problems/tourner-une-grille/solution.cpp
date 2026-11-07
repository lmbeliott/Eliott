#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    int h, w;
    cin >> h >> w;
    vector<string> grille(h);
    for (int i = 0; i < h; i++) {
        cin >> grille[i];
    }

    // La ligne i de la nouvelle grille est la colonne i, lue de bas en haut.
    for (int i = 0; i < w; i++) {
        string ligne = "";
        for (int l = h - 1; l >= 0; l--) {
            ligne += grille[l][i];
        }
        cout << ligne << "\n";
    }
    return 0;
}
