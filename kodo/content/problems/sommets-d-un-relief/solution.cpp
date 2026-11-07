#include <iostream>
#include <string>
#include <vector>
using namespace std;

bool est_sommet(const vector<string> &g, int i, int j) {
    int n = g.size();
    int m = g[0].size();
    for (int a = -1; a <= 1; a++) {
        for (int b = -1; b <= 1; b++) {
            int ni = i + a;
            int nj = j + b;
            // (a, b) = (0, 0) désigne la case elle-même : on l'ignore.
            if ((a != 0 || b != 0) && 0 <= ni && ni < n && 0 <= nj && nj < m) {
                if (g[ni][nj] >= g[i][j]) {
                    return false;
                }
            }
        }
    }
    return true;
}

int main() {
    int n, m;
    cin >> n >> m;
    vector<string> g(n);
    for (int i = 0; i < n; i++) {
        cin >> g[i];
    }
    int total = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            if (est_sommet(g, i, j)) {
                total = total + 1;
            }
        }
    }
    cout << total << "\n";
    return 0;
}
