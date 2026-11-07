#include <iostream>
#include <string>
#include <vector>
using namespace std;

int voisins_vivants(const vector<string>& grille, int i, int j) {
    int r = grille.size();
    int c = grille[0].size();
    int total = 0;
    for (int di = -1; di <= 1; di++) {
        for (int dj = -1; dj <= 1; dj++) {
            if (di != 0 || dj != 0) {
                int a = i + di;
                int b = j + dj;
                if (0 <= a && a < r && 0 <= b && b < c && grille[a][b] == '#') {
                    total = total + 1;
                }
            }
        }
    }
    return total;
}

vector<string> generation_suivante(const vector<string>& grille) {
    // on construit une nouvelle grille : l'ancienne ne doit pas changer pendant le calcul
    vector<string> nouvelle = grille;
    for (int i = 0; i < (int)grille.size(); i++) {
        for (int j = 0; j < (int)grille[0].size(); j++) {
            int v = voisins_vivants(grille, i, j);
            if (v == 3 || (v == 2 && grille[i][j] == '#')) {
                nouvelle[i][j] = '#';
            } else {
                nouvelle[i][j] = '.';
            }
        }
    }
    return nouvelle;
}

int main() {
    int r, c, k;
    cin >> r >> c >> k;
    vector<string> grille(r);
    for (int i = 0; i < r; i++) {
        cin >> grille[i];
    }
    for (int t = 0; t < k; t++) {
        grille = generation_suivante(grille);
    }
    for (int i = 0; i < r; i++) {
        cout << grille[i] << "\n";
    }
    return 0;
}
