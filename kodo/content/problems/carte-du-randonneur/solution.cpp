#include <iostream>
#include <string>
#include <vector>
#include <cstdlib>
using namespace std;

int main() {
    int h, w;
    cin >> h >> w;
    vector<string> carte(h);
    for (int i = 0; i < h; i++) {
        cin >> carte[i];
    }

    // On cherche la position de Yanis et celle du refuge.
    int ly = 0, cy = 0, lr = 0, cr = 0;
    for (int i = 0; i < h; i++) {
        for (int j = 0; j < w; j++) {
            if (carte[i][j] == 'Y') {
                ly = i;
                cy = j;
            }
            if (carte[i][j] == 'R') {
                lr = i;
                cr = j;
            }
        }
    }

    // Pas verticaux + pas horizontaux.
    cout << abs(ly - lr) + abs(cy - cr) << "\n";
    return 0;
}
