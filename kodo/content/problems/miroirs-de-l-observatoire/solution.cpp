#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    int h, w;
    cin >> h >> w;
    vector<string> salle(h);
    for (int i = 0; i < h; i++) {
        cin >> salle[i];
    }

    // eclairee[i][j] vaut true si le rayon est déjà passé par la case (i, j).
    vector<vector<bool>> eclairee(h, vector<bool>(w, false));
    int nb = 0;

    // Position du rayon, et direction : (dl, dc) est ce qu'on ajoute
    // à la ligne et à la colonne à chaque pas. Au départ, vers la droite.
    int l = 0, c = 0;
    int dl = 0, dc = 1;

    while (l >= 0 && l < h && c >= 0 && c < w) {
        if (!eclairee[l][c]) {
            eclairee[l][c] = true;
            nb++;
        }
        if (salle[l][c] == '/') {
            // droite -> haut, haut -> droite, gauche -> bas, bas -> gauche
            int ancien = dl;
            dl = -dc;
            dc = -ancien;
        } else if (salle[l][c] == '\\') {
            // droite -> bas, bas -> droite, gauche -> haut, haut -> gauche
            int ancien = dl;
            dl = dc;
            dc = ancien;
        }
        l += dl;
        c += dc;
    }

    cout << nb << "\n";
    return 0;
}
