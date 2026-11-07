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

    long long total = 0;
    // On choisit les deux lignes du rectangle : celle du haut et celle du bas.
    for (int haut = 0; haut < h; haut++) {
        for (int bas = haut + 1; bas < h; bas++) {
            // Colonnes où les deux lignes ont une case marquée.
            long long k = 0;
            for (int c = 0; c < w; c++) {
                if (grille[haut][c] == '#' && grille[bas][c] == '#') {
                    k = k + 1;
                }
            }
            // Deux de ces colonnes, n'importe lesquelles, forment un rectangle.
            total = total + k * (k - 1) / 2;
        }
    }

    cout << total << "\n";
    return 0;
}
