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

    for (int i = 0; i < h; i++) {
        string ligne = "";
        for (int j = 0; j < w; j++) {
            if (grille[i][j] == '*') {
                ligne += '*';
            } else {
                // On compte les mines parmi les huit voisines.
                int nb = 0;
                for (int di = -1; di <= 1; di++) {
                    for (int dj = -1; dj <= 1; dj++) {
                        if (di == 0 && dj == 0) continue;
                        int vi = i + di;
                        int vj = j + dj;
                        // La voisine doit être dans la grille.
                        if (vi >= 0 && vi < h && vj >= 0 && vj < w && grille[vi][vj] == '*') {
                            nb++;
                        }
                    }
                }
                ligne += (char)('0' + nb);
            }
        }
        cout << ligne << "\n";
    }
    return 0;
}
