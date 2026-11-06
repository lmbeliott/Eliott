#include <iostream>
#include <string>
#include <vector>
#include <cstdlib>
using namespace std;

int main() {
    int h, w;
    cin >> h >> w;
    vector<string> grille(h);
    for (int i = 0; i < h; i++) {
        cin >> grille[i];
    }

    // On cherche la position de A et celle de B.
    int la = 0, ca = 0, lb = 0, cb = 0;
    for (int i = 0; i < h; i++) {
        for (int j = 0; j < w; j++) {
            if (grille[i][j] == 'A') {
                la = i;
                ca = j;
            }
            if (grille[i][j] == 'B') {
                lb = i;
                cb = j;
            }
        }
    }

    // Pas verticaux + pas horizontaux.
    cout << abs(la - lb) + abs(ca - cb) << "\n";
    return 0;
}
