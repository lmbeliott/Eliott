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
    string ordres;
    cin >> ordres;

    // On cherche la case de départ.
    int l = 0, c = 0;
    for (int i = 0; i < h; i++) {
        for (int j = 0; j < w; j++) {
            if (grille[i][j] == 'D') {
                l = i;
                c = j;
            }
        }
    }

    // visitee[i][j] vaut true si le robot est déjà passé sur la case (i, j).
    vector<vector<bool>> visitee(h, vector<bool>(w, false));
    visitee[l][c] = true;
    int nb = 1;

    for (char o : ordres) {
        // Case visée par l'ordre.
        int nl = l, nc = c;
        if (o == 'N') nl = l - 1;
        else if (o == 'S') nl = l + 1;
        else if (o == 'E') nc = c + 1;
        else nc = c - 1;  // 'O'
        // Hors de la grille ou obstacle : l'ordre est ignoré.
        if (nl >= 0 && nl < h && nc >= 0 && nc < w && grille[nl][nc] != '#') {
            l = nl;
            c = nc;
            if (!visitee[l][c]) {
                visitee[l][c] = true;
                nb++;
            }
        }
    }

    cout << nb << "\n";
    return 0;
}
