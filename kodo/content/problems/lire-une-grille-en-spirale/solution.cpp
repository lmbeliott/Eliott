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

    // Les quatre directions, dans l'ordre où l'on tourne : droite, bas, gauche, haut.
    int dl[4] = {0, 1, 0, -1};
    int dc[4] = {1, 0, -1, 0};

    vector<vector<bool>> vu(h, vector<bool>(w, false));
    int l = 0, c = 0, d = 0;
    string lettres = "";
    for (int k = 0; k < h * w; k++) {
        lettres += grille[l][c];
        vu[l][c] = true;
        // Si la case suivante sort de la grille ou a déjà été lue, on tourne d'un quart de tour.
        int nl = l + dl[d], nc = c + dc[d];
        if (nl < 0 || nl >= h || nc < 0 || nc >= w || vu[nl][nc]) {
            d = (d + 1) % 4;
            nl = l + dl[d];
            nc = c + dc[d];
        }
        l = nl;
        c = nc;
    }

    cout << lettres << "\n";
    return 0;
}
