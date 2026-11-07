#include <iostream>
#include <string>
#include <vector>
using namespace std;

int voisines_vivantes(const vector<string> &g, int i, int j) {
    int n = g.size();
    int m = g[0].size();
    int total = 0;
    for (int a = -1; a <= 1; a++) {
        for (int b = -1; b <= 1; b++) {
            int ni = i + a;
            int nj = j + b;
            // (0, 0) est la case elle-même ; hors de la grille, tout est mort.
            if ((a != 0 || b != 0) && 0 <= ni && ni < n && 0 <= nj && nj < m) {
                if (g[ni][nj] == '#') {
                    total = total + 1;
                }
            }
        }
    }
    return total;
}

// Nouvelle grille, calculée uniquement à partir de l'ancienne.
vector<string> generation(const vector<string> &g) {
    int n = g.size();
    int m = g[0].size();
    vector<string> h = g;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            int v = voisines_vivantes(g, i, j);
            if (v == 3 || (g[i][j] == '#' && v == 2)) {
                h[i][j] = '#';
            } else {
                h[i][j] = '.';
            }
        }
    }
    return h;
}

int main() {
    int n, m, k;
    cin >> n >> m >> k;
    vector<string> g(n);
    for (int i = 0; i < n; i++) {
        cin >> g[i];
    }
    for (int t = 0; t < k; t++) {
        g = generation(g);
    }
    for (int i = 0; i < n; i++) {
        cout << g[i] << "\n";
    }
    return 0;
}
