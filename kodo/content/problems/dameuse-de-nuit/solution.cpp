#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    int h, w;
    cin >> h >> w;
    vector<string> carte(h);
    for (int i = 0; i < h; i++) {
        cin >> carte[i];
    }
    string ordres;
    cin >> ordres;

    // On cherche la case de départ.
    int l = 0, c = 0;
    for (int i = 0; i < h; i++) {
        for (int j = 0; j < w; j++) {
            if (carte[i][j] == 'D') {
                l = i;
                c = j;
            }
        }
    }

    // damee[i][j] vaut true si la dameuse est déjà passée sur la case (i, j).
    vector<vector<bool>> damee(h, vector<bool>(w, false));
    damee[l][c] = true;
    int nb = 1;

    for (char o : ordres) {
        // Case visée par l'ordre.
        int nl = l, nc = c;
        if (o == 'N') nl = l - 1;
        else if (o == 'S') nl = l + 1;
        else if (o == 'E') nc = c + 1;
        else nc = c - 1;  // 'O'
        // Hors de la carte ou sapin : l'ordre est ignoré.
        if (nl >= 0 && nl < h && nc >= 0 && nc < w && carte[nl][nc] != '#') {
            l = nl;
            c = nc;
            if (!damee[l][c]) {
                damee[l][c] = true;
                nb++;
            }
        }
    }

    cout << nb << "\n";
    return 0;
}
